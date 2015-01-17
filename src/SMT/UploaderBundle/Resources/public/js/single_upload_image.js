$(function() {
    var btn = $("#uploadBtn");
    var form = btn.closest("form");
    var wrapper = btn.closest("#uploaderWrapper");
    var url = btn.data("url");
    var uploader = new plupload.Uploader({
        browse_button: btn.get(0),
        url: url,
        multi_selection: false,
        filters : [
            {title : "Image files", extensions : "jpg,gif,png"}
        ]
    });
    uploader.init();

    console.log(uploader);


    //Adding new file markup
    uploader.bind('FilesAdded', function(up, files) {
        if(files.length <= 1) {
            var p = $("<p/>").attr("id", files[0].id);
            p.html(files[0].name + ' (' + plupload.formatSize(files[0].size) + ')<b></b>');
            wrapper.find('.fakefile button').empty().append(p);
            uploader.start();
        }
    });

    //Storing uploaded files id's for later attaching with entity
    uploader.bind("FileUploaded", function(up, file, data) {
        var res = $.parseJSON(data.response);
        if(res.success) {
            var ids = form.find("#imagesIds").val();
            ids = ids.split(",");
            ids.push(res.id);
            form.find("#imagesIds").val(ids.join(",").replace(/(^,)|(,$)/g, ""));
            wrapper.find(".thumbnail img").attr("src", window.URL.createObjectURL(file.getSource().getSource()));
        } else {
            wrapper.find('.fakefile button').css("color", "red").text("Error occured while uploading file.");
        }
    });

    uploader.bind('UploadProgress', function(up, file) {
        wrapper.find("#"+file.id).find('b').html(file.percent + "%");
    });

    uploader.bind('Error', function(up, err) {
        wrapper.find('.console').innerHTML += "\nError #" + err.code + ": " + err.message;
    });

    //$("body").on("click", "button[type='submit']", function (e) {
    //    e.preventDefault();
    //    uploader.start();
    //});

    function getFormData(form) {
        var inputs = form.find("input, select, textarea");
        var data = {};
        $.each(inputs, function(i, v) {
            data[$(v).attr("name")] = $(v).val();
        });
        return data;
    }

});