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
            data.id = parseInt(data.id? data.id:0);
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
        , enviar_foto: function(){
            const uuid = token.uuidv4();
            const input_files = $("#foto_upload")[0].files;
            const product = this.array_data_form();

            if (input_files.length==0){
                alert("Seleccione una imagen.");
                return;
            }
            if (product.id==0){
                alert("Nesecita guardar el registro para subir las imagenes");
                return;
            }
           
            var formData = new FormData();    
            var url = url_path+'form/imagen';
            formData.append('uuid', uuid);
            formData.append('product_id', product.id);
            formData.append('image', input_files[0]);
            

            $.ajax({
                type: "POST"
                , url: url
                , data: formData
                , mimeType: "multipart/form-data"
                , contentType: false
                , cache: false
                , processData: false
                , success: function(response){
                    console.log(response);
                    $("#foto_upload").val(null);
                    alert("¡Guardado con exito!");
                    location.reload();
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert(errorThrown);
                },
            });                
                 
        }
        , btn_elegir_imagen(id){
            const producto = this.array_data_form();
            const data = {id: id, producto_id: producto.id};

            if(!Boolean(id) || !Boolean(producto.id)){
                alert("Faltan parametros");
                return;
            }else{
                $.ajax({
                    type: "POST",
                    url: url_path+'form/imagen/active',
                    data: data,
                    dataType: 'json'
                    ,success: function(response){
                        
                        if(response.code == 200){
                            console.log(response);
                            $('#image_active').attr('src', `/imagen/${response.data[0].uuid}.jpg`);

                        }
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                    },
                });
                
            }
            
        }
        
    };
})();