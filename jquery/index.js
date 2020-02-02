$(function () {
    fetchArticle()
})

function fetchArticle() {
    $.ajax({
        url: "http://110.74.194.124:15011/v1/api/articles?page=1&limit=15",
        method: "GET",
        success: function (response) {
            console.log(response);
            appendToTable(response.DATA)
        },
        error: function (error) {
            console.log(error);
        }
    })
}
let content = ""
function appendToCard(Image) {
    for (a of Image) {
        content += ` <img src="${a.thumbnailUrl}" class="card-img-top" alt="image" >`
    }
    $('.card-body').html(content)
}
function appendToTable(articles) {
    let content=''
    for (a of articles) {
        content += `
        <tr>
            <th scope="row">${a.TITLE}</th>
            <td>${a.DESCRIPTION}</td>  
            <td>${a.ID}</td>
            <td>${subDate(a.CREATED_DATE)}</td>
            <td><button type="button" class="btn btn-outline-primary btn-rounded waves-effect " onclick="goToDetail(${a.ID})">View</button></td>
            <td><button type="button" class="btn btn-danger"onclick="deleteArticle(${a.ID})">DELETE</button></td>
            <td><button type="button" class="btn btn-success"onclick="editArticle(this)" data-id=${a.ID}>Edit</button></td>
        </tr`
    }
    $('tbody').html(content)
}
function subDate(fullDate) {
    var year = fullDate.substring(0, 4);
    var month = fullDate.substring(4, 6);
    var day = fullDate.substring(6, 8);
    let date = [year, month, day]
    return date.join('/');
}
function fetchArticle2() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/photos",
        method: "GET",
        success: function (response) {
            console.log(response);
            appendToCard(response)
        },
        error: function (error) {
            console.log(error);
        }
    })
}
function goToDetail(id) {
    window.location.href = `detail.html?id=${id}`
}
function deleteArticle(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: `http://110.74.194.124:15011/v1/api/articles/${id}`,
                    method: "DELETE",
                    success: function (response) {
                        console.log(response); fetchArticle()
                    },
                    error: function (error) 
                    {
                        console.log(error);
                    }
                })
                swal("Poof! Your imaginary file has been deleted!", {
                    icon: "success", 
                });
            } else {
                swal("Your imaginary file is safe!");
            }
        });

}
$(function(){
    fetchArticle()
    $('#showModal').on('click',function(){
        $('#articleModal').modal("show") 
        $('#modalTitle').text('Add Title:')
        $('#title').val('')
        $('#desc').val('')
        $('#image').val('')
    })
    $('#save').on('click',function(){
        console.log($('#article').val());
        let article={
            TITLE:$('#title').val(),
            DESCRIPTION:$("#desc").val(),
            IMAGE:$('#image').val()
        }
        
        console.log(article);
        if('#modalTitle'=="Add Article:")
            addArticle(article)   
        else
            updateArticle(article,$('#aid').val())
    })
})
function addArticle(article)
{
    $.ajax({
        url:"http://110.74.194.124:15011/v1/api/articles",
        method:"post",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success:function(res){
            console.log(res)
            fetchArticle();
            $('#articleModal').modal("hide") 
        },
        error:function(er){
            console.log(er);  
        }

    })
}
$('#searchArticles').on("keyup",function(){
    console.log($("#searchArticles").val());
    searchArticles($('#searchArticles').val())
    
})
function searchArticles(searchKey){
        $.ajax({
            url: `http://110.74.194.124:15011/v1/api/articles?title=${searchKey}&page=1&limit=15`,
            method: "GET",
            success: function (response) {
                console.log(response);
                appendToTable(response.DATA)
            },
            error: function (error) {
                console.log(error);
            }
        })
}
function editArticle(btnEdit)
{
    //Call modal 
    $('#articleModal').modal('show')
    $('#modalTitle').text('Edit Article');
    //get value
    let title=$(btnEdit).parent().siblings().eq(0).text();
    let desc=$(btnEdit).parent().siblings().eq(1).text();
    let id=$(btnEdit).parent().siblings().eq(2).text();
    //let img=$(btnEdit).parent().siblings().
    //setValue to Modal
    $('#title').val(title);
    $('#desc').val(desc);
    $('#image').val('https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg');
   $('#aid').val($(btnEdit).attr('data-id'))
  
}
function updateArticle(article,id)
{
    $.ajax({
        url:`http://110.74.194.124:15011/v1/api/articles/${id}`,
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success:function(res){
            console.log(res)
            fetchArticle();
            $('#articleModal').modal("hide") 
        },
        error:function(er){
            console.log(er);  
        }

    })
}
