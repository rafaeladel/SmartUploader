$(function () {
    var btn = $("#uploadBtn");
    var form = btn.closest("form");
    var wrapper = btn.closest("#uploaderWrapper");
    var thumbWrapper = wrapper.find(".attachment-wrap");
    var url = btn.data("url");
    var uploader = new plupload.Uploader({
        browse_button: btn.get(0),
        url: url,
        multi_selection: true,
        filters: [
            {title: "Image files", extensions: "jpg,gif,png"}
        ]
    });
    uploader.init();

    //Adding new file markup
    uploader.bind('FilesAdded', function (up, files) {
        $.each(files, function (i, file) {
            var thumb = getUploadingThumbBlock(file.id);
            thumbWrapper.append(thumb);
        });

        //var p = $("<p/>").attr("id", files[0].id);
        //p.html(files[0].name + ' (' + plupload.formatSize(files[0].size) + ')<b></b>');
        //wrapper.find('.fakefile button').empty().append(p);
        uploader.start();
    });

    uploader.bind("QueueChanged", function (up) {
        wrapper.find("#totalFilesInfo").hide();
        if (up.files.length > 0) {
            wrapper.find("#totalFilesInfo").show().find("#totalFiles").text(up.files.length);
        }
    });

    //Storing uploaded files id's for later attaching with entity
    uploader.bind("FileUploaded", function (up, file, data) {
        populateIds(data, form);
        var data = $.parseJSON(data.response);
        var img = window.URL.createObjectURL(file.getSource().getSource());
        var completedThumb = getCompletedThumbBlock(file.id, img, data);
        var thumb = wrapper.find("#" + file.id);
        thumb.replaceWith(completedThumb);
    });

    uploader.bind('UploadProgress', function (up, file) {
        thumbWrapper.find("#" + file.id).find('.progressbar-percent').css("width", file.percent + "%");
    });

    uploader.bind('Error', function (up, err) {
        wrapper.find('.console').innerHTML += "\nError #" + err.code + ": " + err.message;
    });

    $("body").on("click", ".attachment-remove", function (e) {
        e.preventDefault();

        var file_thumb = $(e.target).closest(".attachment-block");
        var file_id = file_thumb.attr("id");
        file_thumb.remove();

        //using e.currentTarget because e.target returns the <i></i> inside the anchor
        $.ajax({
            type: "POST",
            url: $(e.currentTarget).attr("href"),
            success: function (data) {
                if (data.success) {
                    uploader.removeFile(uploader.getFile(file_id));
                } else {
                    thumbWrapper.append(file_thumb);
                }
            }
        });
    });

    $("body").on("click", "#totalFilesDelete", function (e) {
        e.preventDefault();

        var queueLength = uploader.files.length;
        for (i = 0; i < queueLength; i++) {
            if (uploader.files[i] && uploader.files[i] !== undefined) {
                $("body").find("#"+uploader.files[i].id).find(".attachment-remove").click();
            }
        }
    });
});

function getUploadingThumbBlock(file_id) {
    var div = $("<div class='attachment-block add-radius' id=\"" + file_id + "\" />");

    var content = "<img class=\"thumbnail\" src=\"#\"/> \
        <a href=\"#\" class=\"attachment-remove\"><i class=\"icon-remove\"></i></a> \
        <div class=\"progressbar\"> \
        <div class=\"progressbar-percent\" style=\"width: 0%; background-color: rgb(55, 184, 235);\" attr-percent=\"100\"></div> \
        </div>\
    </div>";

    div.html(content);
    return div;
}

function getCompletedThumbBlock(file_id, img, data) {

    var div = $("<div class='attachment-block add-radius' id=\"" + file_id + "\" data-file_db="+data.id+" />");

    var content = "<img src=\"" + img + "\"/> \
            <div class=\"attachment-hover\"> \
            <a href=\"" + data.delete_url + "\" class=\"attachment-remove\"><i class=\"icon-remove\"></i></a> \
            <h4>اسم الملف</h4> \
            </div>";

    div.html(content);
    return div;
}

function populateIds(data, form) {
    var res = $.parseJSON(data.response);
    var ids = form.find("#imagesIds").val();
    ids = ids.split(",");
    ids.push(res.id);
    form.find("#imagesIds").val(ids.join(",").replace(/(^,)|(,$)/g, ""));
}