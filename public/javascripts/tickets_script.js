//Encapsulamiento de codigo  javascript fron-end
const url= location.origin;

var ticket =( function(){

    $("#form_ticket").on("submit", function(event){
        var ticket_detalle = JSON.parse($('#ticket_detalle').val());
        if (ticket_detalle && ticket_detalle.length>0){
            return true;
        }
        alert( "Ingrese productos al carrito." );
        event.preventDefault();

        return false;
    });

    $("#search_product").on("submit", function(event){
        event.preventDefault();
        var search = $("#search").val();
        $.ajax({
            type: "POST",
            url: url+"/ticket/product/search",
            data: {'search': search},
            dataType: "json",
            success: function (response) {
                if(response.code==200 && response.lst_productos){
                    ticket.refrech_productos(response.lst_productos);                     
                }
            },
            error: function(err){
                console.log("Error");
                console.log(err);
            }
        });
        return false;
    });
    return {
        clear_table: function(){
            $("#car-product").html('');
        }
        , add_product(id){ 
            var data = {id: id, ticket_detalle: $('#ticket_detalle').val() ? $('#ticket_detalle').val() : '' }
            $.ajax({
                type: "POST",
                url: url+"/form/ticket/add-car",
                data: data,
                dataType: "json",
                success: function (response) {
                    if(response.code==200){
                        ticket.update_encabezado(response);                                                
                    }
                },
                error: function(err){
                    console.log("Error");
                    console.log(err);
                }
            });
        }
        , update_encabezado(response){
            console.log(response);
            $('#total').val(response.total);
            $('#cantidad').val(response.cantidad);
            $('#total-txt').text(response.total);
            $('#cantidad-txt').text(response.cantidad);

            ticket.refresh_table(response.lista);
        }
        , refresh_table(car_list){
            ticket.clear_table();
            $('#ticket_detalle').val(JSON.stringify(car_list));            
            if(car_list && car_list.length>0) {
                
                for(const element of car_list){
                    console.log(element.id);
                    $("#car-product").append(`
                        <tr ondblclick="ticket.del_product(${element.producto_id})">
                            <td>${element.cantidad}</td>
                            <td>${element.descripcion}</td>
                            <td>${element.precio}</td>
                            <td>${element.precio*element.cantidad}</td>
                        </tr>
                    `);
                }
            }

        }
        , refrech_productos(lst_productos){
            if(lst_productos.length>0){
                $("#lst_catalogo_productos").html('');
                for(const element of lst_productos){
                    $("#lst_catalogo_productos").append(`
                        <div class="card" style="width: 10rem;">
                            <img src="data:image/png;base64,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" class="card-img-top" alt="...">
                            <div class="card-body">
                            <p class="card-text">${'['+element.sku+'] '+element.nombre}</p>
                            <p class="card-text">${element.precio}</p>
                            
                            </div>
                            <div class="card-footer">
                                <a href="#" id="add-lista" onclick="ticket.add_product('${element.id}')" class="btn btn-primary w-100">Agregar</a>
                            </div>
                        </div>                    
                    `);
                }
            }
        }  
        , del_product(producto_id){
            var lst_productos = JSON.parse($('#ticket_detalle').val())
            console.log(lst_productos);
            var index = -1;

            for(let i=0; i< lst_productos.length++; i++){
                if(lst_productos[i].producto_id===producto_id){
                    index= i;
                    break;
                }
            }

            if(index>=0){
                lst_productos =lst_productos.splice(index,1);
                ticket.refresh_table(lst_productos);
            }
        }    
    }
})();