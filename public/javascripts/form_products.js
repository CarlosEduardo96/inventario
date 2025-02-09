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
        , accion: function(){
            var active = $("#id").val() && $("#id").val()>0? $("#id").val(): false;
            const data = $("#form_product").serializeArray().reduce(
                function(objet, data) { objet[data.name] = data.value; return objet; }, {}
            );
            if(active){
                this.guardar(data);
            }
            else{
                this.editar(data);
            }
        }
        ,guardar: function(data){
            alert(token.uuidv4());
        }
        , editar:function(data){
            alert(token.uuidv4());
        }
        // , view_list: function(){
        //     $("#view_list").on('click', true);
        // }
    };
})();