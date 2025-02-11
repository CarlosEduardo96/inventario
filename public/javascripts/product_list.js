const url_path=location.origin+'/product/';
var product=(function(){
    return{
        start: function(){}
        ,eliminar(product_id){
            $.ajax({
                type: "POST",
                url: url_path+'delete',
                data: {id: product_id},
                dataType: 'json'
                ,success: function(response){
                    console.log(response);
                    alert("¡Eliminado con exito!");
                    location.reload();
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert(errorThrown);
                },
            });
        }
    };
})();