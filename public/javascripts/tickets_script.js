//Encapsulamiento de codigo  javascript fron-end
const url= location.origin;

var ticket =( function(){

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
                    $("#car-product").append(`
                        <tr>
                            <td>${element.cantidad}</td>
                            <td>${element.descripcion}</td>
                            <td>${element.precio}</td>
                            <td>${element.precio*element.cantidad}</td>
                        </tr>
                    `);
                }
            }

        }       
    }
})();