var vLogin=new Vue({el:"#login",data:{messages:[],username:"",password:""},computed:{isValid:function(){return!this.errors.any()&&""!=this.username&&""!=this.password}},methods:{onSubmit:function(){if(!this.errors.any()){var e={username:this.username,password:this.password};this.$http.post("/api/auth/login",e).then(function(e){var s=e.body.token;if(s){var t=e.email;localStorage.setItem("token",s),localStorage.setItem("currentUser",JSON.stringify({email:t,username:this.username,token:s,sid:e.body.sid})),document.location.href="/home"}else this.messages.push({type:"error",message:"Username or password incorrect"})},function(e){404==e.status?this.messages.push({type:"error",message:"Page Not Found: "+e.url}):this.messages.push({type:"error",message:e.body.message})})}}}});