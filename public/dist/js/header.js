var vHeader=new Vue({el:"header",data:{loggedIn:!1},created:function(){this.loggedIn=Vue.tokenValid()},methods:{openContactModal:function(){var e=document.querySelector("#contact-modal"),o=document.querySelector("#modal-overlay");e.classList.toggle("closed"),o.classList.toggle("closed")},logout:function(){localStorage.removeItem("currentUser"),localStorage.removeItem("token"),document.location.href="/"}}}),vContactModal=new Vue({el:"#contactModalContainer",data:{loggedIn:!1,messages:[],fname:"",lname:"",email:"",query:"",mobile:""},created:function(){this.loggedIn=Vue.tokenValid()},methods:{close:function(){var e=document.querySelector("#contact-modal"),o=document.querySelector("#modal-overlay");e.classList.toggle("closed"),o.classList.toggle("closed")}}});