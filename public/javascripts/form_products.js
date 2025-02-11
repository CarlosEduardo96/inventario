const url_path=location.origin+'/product/';

var product = (function(){
    
    function cargar_boton_imagen(){
        var active = $("#id").val() && $("#id").val()>0? $("#id").val(): false;
        if (active){
            $("#btn_foto").show();
        }
        else {
            $("#btn_foto").hide();
        }
    };

    return{
        start: function(){
            // cargar_boton_imagen();
        }
        , array_data_form: function(){
            var data = $("#form_product").serializeArray().reduce(
                function(objet, data) { objet[data.name] = data.value; return objet; }, {}
            );
            return data;
        }
        , accion: function(){
            const data = this.array_data_form();
            this.guardar(data);
            
        }
        ,guardar: function(data){
            $.ajax({
                type: "PUT",
                url: url_path+'form/save',
                data: data,
                dataType: 'json'
                ,success: function(response){
                    console.log(response);
                    alert("¡Guardado con exito!");
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert(errorThrown);
                },
            });
        }
        , enviar_foto:function(){
            const uuid = token.uuidv4();
            const files = $("#foto_upload");
            const product = this.array_data_form();

            if(product.id && product.id>0){
                var formData = new FormData();    
                var url = url_path+'form/imagen';
                formData.append('uuid', uuid);
                formData.append('product_id', product.id);
                formData.append('image', files[0]);
                

                $.ajax({
                    type: "PUT"
                    , url: url
                    , data: formData
                    , processData: false  // tell jQuery not to process the data
                    , contentType: false  // tell jQuery not to set contentType
                    , success: function(response){
                        console.log(response);
                        alert("¡Guardado con exito!");
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                    },
                });                
            }else{
                alert("Nesecita guardar el registro para subir las imagenes");
            }          

        }
        // , view_list: function(){
        //     $("#view_list").on('click', true);
        // }
    };
})();