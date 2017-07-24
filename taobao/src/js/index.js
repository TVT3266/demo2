;(function(win){
    //页面
    function Page(){
        this.$el=null;
        this.size={
            width:0,
            height:0
        };
        this.orientation=null;
        this.move={
            startX:0,
            startY:0,
            intervalX:0,
            intervalY:0,
            orientation:null
        };
        //页面的子页面
        this.childPage={
            $el:[],
            coordinate:[],
            length:0
        };
        //页面的分页符
        this.pagination={
            $el:null,
            bullet:{
                $el:[],
                selection:[],
                length:0
            }
        };
    }
    Page.prototype={
        constructor:Page,
        moveXY:function(el,x,y){
            var moveX=(x+'').match(/([-\d\.]+)([^\d\.]{0,})/),
                moveY=(y+'').match(/([-\d\.]+)([^\d\.]{0,})/);
            el&&(el.style.transform='translate3d('+moveX[1]+(moveX[2]||'px')+','+moveY[1]+(moveY[2]||'px')+',0)');
        },
        touchstart:function(e){
            this.move.startX=e.touches[0].pageX;
            this.move.startY=e.touches[0].pageY;
            this.move.intervalX=0;
            this.move.intervalY=0;
            this.move.orientation=null;
        },
        touchmove:function(e){
            var moveX=e.touches[0].pageX-this.move.startX,
                moveY=e.touches[0].pageY-this.move.startY;
            if(!this.move.orientation){
                this.move.orientation=(Math.abs(moveX)>Math.abs(moveY)?'X':'Y');
            }
            if(this.move.orientation===this.orientation){
                e.preventDefault();
                e.stopPropagation();
                switch(this.orientation){
                    case 'X':
                        this.move.intervalX=moveX;
                        this.move.intervalY=0;
                        break;
                    case 'Y':
                        this.move.intervalX=0;
                        this.move.intervalY=moveY;
                        break;
                }
                for(var i=0;i<this.childPage.length;i++){
                    this.moveXY(this.childPage.$el[i],this.childPage.coordinate[i].x+this.move.intervalX,this.childPage.coordinate[i].y+this.move.intervalY);
                }
            }
        },
        touchend:function(e){
            var moveRange,
                i;
            if(this.orientation==='X'){
                moveRange=this.size.width/3;
            }else{
                moveRange=this.size.height/3;
            }
            if(this.move.intervalX>moveRange||this.move.intervalY>moveRange){
                this.childPage.$el.unshift(this.childPage.$el[this.childPage.length-1]);
                this.childPage.$el.pop();

                this.pagination.bullet.$el.unshift(this.pagination.bullet.$el[this.pagination.bullet.length-1]);
                this.pagination.bullet.$el.pop();
                for(i=0;i<this.pagination.bullet.length;i++){
                    this.pagination.bullet.$el[i].classList.remove('z-sel');
                    this.pagination.bullet.$el[i].classList.remove('z-hide');
                    this.pagination.bullet.$el[i].classList.add(this.pagination.bullet.selection[i]);
                }

                for(i=0;i<this.childPage.length;i++){
                    this.childPage.$el[i].style.zIndex='0';
                }
                this.childPage.$el[0].style.zIndex='1';
                this.childPage.$el[1].style.zIndex='1';
                this.childPage.$el[2].style.zIndex='1';
            }
            else if(this.move.intervalX<-moveRange||this.move.intervalY<-moveRange){
                this.childPage.$el.push(this.childPage.$el[0]);
                this.childPage.$el.shift();

                this.pagination.bullet.$el.push(this.pagination.bullet.$el[0]);
                this.pagination.bullet.$el.shift();
                for(i=0;i<this.pagination.bullet.length;i++){
                    this.pagination.bullet.$el[i].classList.remove('z-sel');
                    this.pagination.bullet.$el[i].classList.remove('z-hide');
                    this.pagination.bullet.$el[i].classList.add(this.pagination.bullet.selection[i]);
                }

                for(i=0;i<this.childPage.length;i++){
                    this.childPage.$el[i].style.zIndex='0';
                }
                this.childPage.$el[this.childPage.length-1].style.zIndex='1';
                this.childPage.$el[0].style.zIndex='1';
                this.childPage.$el[1].style.zIndex='1';
            }
            for(i=0;i<this.childPage.length;i++){
                clearInterval(this.childPage.$el[i].timer);
                this.childPage.$el[i].timer=setInterval(function(self,i){
                    return function(){
                        var key=false,
                            start,
                            end;
                        if(self.orientation==='X'){
                            start=parseInt(self.childPage.$el[i].style.transform.match(/[-\d\.]+/g)[1]);
                            end=self.childPage.coordinate[i].x;
                        }else{
                            start=parseInt(self.childPage.$el[i].style.transform.match(/[-\d\.]+/g)[2]);
                            end=self.childPage.coordinate[i].y;
                        }
                        var speed=(end-start)/8;
                        speed=speed>0?Math.ceil(speed):Math.floor(speed);
                        if(start===end){
                            key=true;
                        }
                        start+=speed;
                        if(self.orientation==='X'){
                            self.moveXY(self.childPage.$el[i],start,0);
                        }else{
                            self.moveXY(self.childPage.$el[i],0,start);
                        }
                        if(key){
                            clearInterval(self.childPage.$el[i].timer);
                        }
                    };
                }(this,i),10);
            }
        },
        touchcancel:function(){},
        //初始化
        init:function(el,pagination,orientation){
            var i;
            this.$el=el;
            this.size.width=this.$el.clientWidth;
            this.size.height=this.$el.clientHeight;
            this.orientation=orientation||'X';
            this.childPage.length=this.$el.children.length;
            for(i=0;i<this.childPage.length;i++){
                this.childPage.$el.push(this.$el.children[i]);
                var x=0,
                    y=0;
                if(this.orientation==='X'){
                    y=0;
                    if(i===this.childPage.length-1){
                        x=-this.size.width;
                    }else{
                        x=this.size.width*i;
                    }
                }
                else if(this.orientation==='Y'){
                    x=0;
                    if(i===this.childPage.length-1){
                        y=-this.size.height;
                    }else{
                        y=this.size.height*i;
                    }
                }
                this.childPage.coordinate.push({
                    x:x,
                    y:y
                });
                this.moveXY(this.childPage.$el[i],this.childPage.coordinate[i].x,this.childPage.coordinate[i].y);
            }
            this.pagination.$el=pagination;
            this.pagination.bullet.length=this.pagination.$el.children.length;
            for(i=0;i<this.pagination.bullet.length;i++){
                this.pagination.bullet.$el.push(this.pagination.$el.children[i]);
                if(i===0){
                    this.pagination.bullet.selection.push('z-sel');
                }else{
                    this.pagination.bullet.selection.push('z-hide');
                }
                this.pagination.bullet.$el[i].classList.add(this.pagination.bullet.selection[i]);
            }

            //定时器轮播
            var self=this;
            this.$el.timer=setInterval(function(){
                self.move.intervalX=-self.size.width;
                self.touchend.call(self);
            },4000);


            'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(handler){
                self.$el.addEventListener(handler,self[handler].bind(self),false);
            });
        }
    };

    //页面
    function Swipe(){
        this.$el=null;
        this.size={
            width:0,
            height:0
        };
        this.orientation=null;
        this.move={
            startX:0,
            startY:0,
            intervalX:0,
            intervalY:0,
            orientation:null
        };
        //页面的子页面
        this.childSwipe={
            $el:null,
            coordinate:{
                x:0,
                y:0
            }
        }
    }
    Swipe.prototype={
        constructor:Swipe,
        moveXY:function(el,x,y){
            var moveX=(x+'').match(/([-\d\.]+)([^\d\.]{0,})/),
                moveY=(y+'').match(/([-\d\.]+)([^\d\.]{0,})/);
            el&&(el.style.transform='translate3d('+moveX[1]+(moveX[2]||'px')+','+moveY[1]+(moveY[2]||'px')+',0)');
        },
        touchstart:function(e){
            this.move.startX=e.touches[0].pageX;
            this.move.startY=e.touches[0].pageY;
            this.move.intervalX=0;
            this.move.intervalY=0;
            this.move.orientation=null;
            this.childSwipe.$el.style.transition='';
        },
        touchmove:function(e){
            var moveX=e.touches[0].pageX-this.move.startX,
                moveY=e.touches[0].pageY-this.move.startY;






            if(height-ftEl.clientHeight-getTop(bd14LastTabEl)>(this.childSwipe.coordinate.y+this.move.intervalY)){
                var xhr=createXHR();
                xhr.open('GET','src/php/index1.php',true);
                xhr.send(null);
                xhr.onreadystatechange=function(){
                    if(xhr.readyState===4){
                        if(xhr.status>=200&&xhr.status<300||xhr.status===304){
                            if(bd14El.key){
                                bd14El.key=false;
                                var json=JSON.parse(xhr.responseText);
                                if(json.success){
                                    for(var j=0;j<json.msg[bd14El.number].length;j++){
                                        var divEl=document.createElement('div');
                                        divEl.innerHTML='<img src="'+json.msg[bd14El.number][j].img+'"/><p class="title f-fs f-fs-12px">'+json.msg[bd14El.number][j].title+'</p><p class="price f-fs f-fs-16px">￥&nbsp'+json.msg[bd14El.number][j].price+'</p>';
                                        divEl.classList.add('tab');
                                        divEl.classList.add('f-fl');
                                        bd14El.appendChild(divEl);
                                    }
                                }
                                bd14El.number++;
                                if(bd14El.number<json.msg.length){
                                    bd14El.key=true;
                                }
                            }
                        }else{
                            alert('请求失败'+xhr.status);
                        }
                    }
                };
            }
            //返回元素到最外层窗口顶端的距离
            function getTop(el){
                var top = 0;
                while(el){
                    top+=el.offsetTop;
                    el=el.offsetParent;
                }
                return top;
            }
            //创建XHR对象
            function createXHR(){
                if(typeof XMLHttpRequest!=='undefined'){
                    //版本：IE7+、Chrome、Safari、Opera和Firefox
                    return new XMLHttpRequest();
                }else if(typeof ActiveXObject!=='undefined'){
                    //版本：IE5和IE6
                    if(typeof arguments.callee.activeXString!=='string'){
                        var versions=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'],
                            i,len;
                        for(i=0,len=versions.length;i<len;i++){
                            try{
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString=versions[i];//正确的versions版本临时存储在arguments.callee.activeXString
                                break;
                            }catch(ex){
                                //跳过
                            }
                        }
                    }
                    return new ActiveXObject(arguments.callee.activeXString);
                }else{
                    throw new Error('No XHR object available.');
                }
            }







            if(!this.move.orientation){
                this.move.orientation=(Math.abs(moveX)>Math.abs(moveY)?'X':'Y');
            }
            if(this.move.orientation===this.orientation){
                e.preventDefault();
                e.stopPropagation();
                switch(this.orientation){
                    case 'X':
                        this.move.intervalX=moveX;
                        this.move.intervalY=0;
                        break;
                    case 'Y':
                        this.move.intervalX=0;
                        this.move.intervalY=moveY;
                        break;
                }
                this.moveXY(this.childSwipe.$el,this.childSwipe.coordinate.x+this.move.intervalX,this.childSwipe.coordinate.y+this.move.intervalY);
            }





        },
        touchend:function(e){
            if(this.orientation==='X'){
                if((this.childSwipe.coordinate.x+this.move.intervalX)<(-this.childSwipe.$el.clientWidth+this.size.width)){
                    this.childSwipe.coordinate.x=-this.$el.parentNode.clientWidth+this.size.width;
                }else if((this.childSwipe.coordinate.x+this.move.intervalX)>0){
                    this.childSwipe.coordinate.x=0;
                }else{
                    this.childSwipe.coordinate.x+=this.move.intervalX;/*2**********************/
                }
            }else if(this.orientation==='Y'){
                if((this.childSwipe.coordinate.y+this.move.intervalY)<(-this.childSwipe.$el.clientHeight+this.size.height)){
                    this.childSwipe.coordinate.y=(-this.childSwipe.$el.clientHeight+this.size.height);
                }else if((this.childSwipe.coordinate.y+this.move.intervalY)>0){
                    this.childSwipe.coordinate.y=0;
                }else{
                    this.childSwipe.coordinate.y+=this.move.intervalY;/*2**********************/
                }

            }
            this.childSwipe.$el.style.transition='transform 0.25s ease-out';
            this.moveXY(this.childSwipe.$el,this.childSwipe.coordinate.x,this.childSwipe.coordinate.y);
        },
        touchcancel:function(){},
        //初始化
        init:function(swipeEl,childSwipeEl,orientation){
            this.$el=swipeEl;
            this.size.width=this.$el.clientWidth;
            this.size.height=this.$el.clientHeight;
            this.orientation=orientation||'X';
            this.childSwipe.$el=childSwipeEl;
            this.childSwipe.coordinate.x=0;
            this.childSwipe.coordinate.y=0;

            'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(handler){
                swipe.$el.addEventListener(handler,swipe[handler].bind(swipe),false);
            });
        }
    };
    win.document.addEventListener('touchmove',function(e){e.preventDefault();},false);

    var page=new Page();
    page.init(document.querySelector('.m-wrap-bd .swiper .slide'),document.querySelector('.m-wrap-bd .swiper .pagination'),'X');

    var page1=new Page();
    page1.init(document.querySelector('.m-wrap-bd .bd-12 .container-1 .wrapper-1 .slide-1'),document.querySelector('.m-wrap-bd .bd-12 .container-1 .pagination-1'),'X');



    var swipe=new Swipe();
    swipe.init(document.querySelector('.g-bd'),document.querySelector('.g-bd .m-wrap-bd'),'Y');

    //创建XHR对象
    function createXHR(){
        if(typeof XMLHttpRequest!=='undefined'){
            //版本：IE7+、Chrome、Safari、Opera和Firefox
            return new XMLHttpRequest();
        }else if(typeof ActiveXObject!=='undefined'){
            //版本：IE5和IE6
            if(typeof arguments.callee.activeXString!=='string'){
                var versions=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'],
                    i,len;
                for(i=0,len=versions.length;i<len;i++){
                    try{
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString=versions[i];//正确的versions版本临时存储在arguments.callee.activeXString
                        break;
                    }catch(ex){
                        //跳过
                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        }else{
            throw new Error('No XHR object available.');
        }
    }
    var bd2El=document.querySelector('.m-wrap-bd .bd-2 .content .active');
    bd2El.cycle=0;
    bd2El.timer=setInterval(function(){
        bd2El.cycle===2?bd2El.cycle=0:bd2El.cycle++;
        var xhr=createXHR();
        xhr.open('GET','src/php/index.php?number='+bd2El.cycle,true);
        xhr.send(null);
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4){
                if(xhr.status>=200&&xhr.status<300||xhr.status===304){
                    var data=JSON.parse(xhr.responseText);
                    if(data.success){
                        bd2El.innerHTML=data.msg;
                    }
                }else{
                    alert('请求失败'+xhr.status);
                }
            }
        }
    },2000);

    var bd3El=document.querySelector('.m-wrap-bd .bd-3 .bd-3-1 .time').getElementsByTagName('span');
    bd3El.timeNow = new Date();
    bd3El.timeEnd = new Date();
    bd3El.timeEnd.setTime(bd3El.timeNow.getTime()+4*60*60*1000); //设置结束时间长度，以毫秒为计算单位，此处设置为04小时00分00秒
    bd3El.timer=setInterval(function(){
        var timeNow = new Date(),
            time, timeHour, timeMinute, timeSecond;
        time = Math.round((bd3El.timeEnd.getTime() - timeNow.getTime())/1000);
        timeSecond = time % 60;
        timeMinute = parseInt(time % 3600 / 60);
        timeHour = parseInt(time % (3600 * 24) / 3600);
        timeSecond < 10 ? timeSecond = "0" + timeSecond : timeSecond += "";
        timeMinute < 10 ? timeMinute = "0" + timeMinute : timeMinute += "";
        timeHour < 10 ? timeHour = "0" + timeHour : timeHour += "";
        bd3El[0].innerText = timeHour;
        bd3El[1].innerText = timeMinute;
        bd3El[2].innerText = timeSecond;
    }, 1000);

    var bd14El=document.querySelector('.m-wrap-bd .bd-14'),
        bd14TabEl=bd14El.getElementsByTagName('div'),
        bd14LastTabEl=bd14TabEl[bd14TabEl.length-1];
    var height=win.document.documentElement.clientHeight,
        ftEl=win.document.querySelector('.g-ft');
    bd14El.key=true;
    bd14El.number=0;



    var sdEl=document.querySelector('.g-sd');
    sdEl.onclick=function(){
        swipe.childSwipe.coordinate.x=0;
        swipe.childSwipe.coordinate.y=0;
        swipe.moveXY(swipe.childSwipe.$el,0,0);
    };

})(window);








