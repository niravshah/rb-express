var editAuthorVue=new Vue({el:"#editAuthorVue",data:{messages:[],author:{fname:"",lname:"",bio:"",avatar:""},postSid:$("meta[name='post-sid']").attr("content"),authorSid:$("meta[name='author-sid']").attr("content"),url:""},created:function(){$(".loader").fadeOut(400),console.log(this.postSid,this.authorSid),this.$http.get("/api/posts/"+this.postSid).then(function(t){console.log("Post",t.body),this.author=t.body.author},function(t){console.log("Error",t)})},computed:{},methods:{previewImage:function(t){var e=this;if(t.target.files&&t.target.files[0]){var o=new FileReader;o.onload=function(t){this.target=t.target,e.url=this.target.result},o.readAsDataURL(t.target.files[0])}},closeBtn:function(t){console.log("Close Button Clicked!",t)},patchAuthorDetails:function(t,e,o){(new Headers).append("Authorization","JWT "+o)}}});