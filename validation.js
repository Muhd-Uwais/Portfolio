$(document).ready(function(){
    $("#contact-form").validate({
        rules : {
            fname:{
                required:true,
                minlength:4,
                maxlength:15
            },
            emaiL:{
                required:true,
                email:true
            },
            subject:{
                required:true,
                minlength:5,
            },
            message:{
                required:true,
                minlength:20,
            }
        },
        submitHandler: function(form, event) {
            form.submit();
            alert("Form submitted successfully");
            window.location.reload();
        },
        invalidHandler: function(event, validator) {
            alert("Form validation failed. Please check all the inputs are correct...");
        }
    })
})


function sent(form){
    $.ajax({
        // url: "https://script.google.com/macros/s/AKfycbzHJkk1wjcSCrm-pWegOqhWcfLvx9B8fsbbY-LW3JzQuFxHYkbkuiIy5bTjIUCWZado5w/exec",
        url: "https://formspree.io/f/mzzgekeo",
        data: $(form).serialize(),
        method: "post",
        success: function (response) {
            alert("Form submitted successfully");
            window.location.reload(); // reload the page after successful submission
        },
        error: function (err) {
            alert("Something Error");
        }
    });
}

