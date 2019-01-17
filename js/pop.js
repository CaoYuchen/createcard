/*!
 * Copyright 2014, 2014 ywang1724 and other contributors
 * Released under the MIT license
 * http://ywang1724.com
 *
 * Date: 2014-09-02
 */

/**
 * 弹出层类	PopLayer
 * 参数说明：args obj
 * @param	title		弹出层标题
 * @param	content		弹出层内容html
 * @param 	isModal		弹出层是否模态
 * @param 	moveable 	弹出层可否移动
 * @param   document	上下文文档对象
 */
(function() {
	
	function PopLayer(args) {
		//初始化参数
		this.title = args.title || "";
		this.content = args.content || "";
		this.isModal = (typeof args.isModal === "boolean") ? args.isModal : true;
		this.moveable = (typeof args.moveable === "boolean") ? args.moveable : true;
		this.document = args.document || document;
		//辅助参数
		this.isDown = false;  //鼠标是否在弹层标题栏按下
		this.offset = {
            "width": 0, 
            "height": 0
        };
        this.id = ++top.PopLayer.id;
		//模态加遮罩层
		var modal = this.getElement();
		if (this.isModal) {
			this.myModal = modal.myModal;
		}
		this.myPop = modal.myPop;
        top.PopLayer.instances[this.id] = this;
		//初始化
		this.init();
	};
	
	PopLayer.prototype = {
		
		init: function() {
			this.initContent();//初始化内容
			this.initEvent();//初始化行为
		},
		
		initContent: function() {
			if (this.isModal) {
                $("body", this.document).append(this.myModal);
                this.myModal.show();
            }
			$("body", this.document).append(this.myPop);
            $(".myPop-title-value", this.myPop).html(this.title);//设置标题
            this.myPop.css("top", (this.document.documentElement.clientHeight - this.myPop.height()  ) / 2 + "px");
			this.myPop.css("left", (this.document.documentElement.clientWidth - this.myPop.width()) / 2 + "px");
            this.myPop.show();
		},
		
		initEvent: function() {
			var $this = this;
			//鼠标按下事件
			$(".myPop-title", this.myPop).on("mousedown", function(e) {
				$this.isDown = true;
				var event = window.event || e;
				//记录按下时鼠标距离弹出层位置
				$this.offset.height = event.clientY - $this.myPop.offset().top;
				$this.offset.width = event.clientX - $this.myPop.offset().left;
                return false;
			});
			//鼠标拖动事件
			$(this.document).mousemove(function(e) {
				 if ($this.isDown && $this.moveable) {
			        var event = window.event || e;
			        //偏移位置
			        var top = event.clientY - $this.offset.height,
                        left = event.clientX - $this.offset.width,
                        maxL = $this.document.documentElement.clientWidth - $this.myPop.width(),
                        maxT = $this.document.documentElement.clientHeight - $this.myPop.height();        
                    left = left < 0 ? 0 : left;
                    left = left > maxL ? maxL : left;      
                    top = top < 0 ? 0 : top;
                    top = top > maxT ? maxT : top;
					$this.myPop.css("top", top + "px");
					$this.myPop.css("left", left + "px");
				}
                return false;
			}).mouseup(function(e) {
				if ($this.isDown) {
					$this.isDown = false;
				}
                return false;
            });
			//关闭事件
			$(".myPop-close", this.myPop).on('click', function() {
                $this.destroy();
                return false;
            });
            $(".create", this.myPop).on('click', function() {
                $this.destroy();
                return false;
            });
            $(".team", this.myPop).on('click', function() {
                $this.destroy();
                return false;
            });
		},
        
		getElement: function() {
			return {
				"myModal": $("<div class='myModal'></div>", this.document),
				"myPop": $("<div class='myPop'>" +
                                "<h2 class='myPop-title'>" +
                                    "<span class='myPop-title-value'></span>" + 
                                    "<span class='myPop-close'><svg style='width:25px;fill:#131414; margin:10px 10px -10px 0' viewBox='0 0 24 24'><path d='M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z'/><path d='M0 0h24v24h-24z' fill='none'/></svg></span>" + 
                                "</h2>" + 
                                "<div class='myPop-content'>" + this.content + "</div>" + 
                           "</div>", this.document)
			};
		},
		
		destroy: function() {
			//清除显示层
			this.myPop.remove();
			//清除存在的遮罩层
			if(this.isModal){
				this.myModal.remove();
			}
            //销毁池中对象
			delete top.PopLayer.instances[this.id];
			//计数器退栈
			top.PopLayer.id--;
		},

	};
	
    if (!top.PopLayer) {
		PopLayer.zIndexCounter = 1000;//z-index计数器
		PopLayer.id = 0;//层对象计数
		PopLayer.instances = {};//层对象池
		
		top.PopLayer = PopLayer;
	}
  
})()



var mousePressed = false;
var lastX, lastY;
var ctx, canvas;
var gender = new Image();

var lineC = "grey",
    lineW = 3;

var number=0;

function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");
    canvas = document.getElementById('myCanvas');

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });

    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = lineC;
        ctx.lineWidth = lineW;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}


function erase() {
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // document.getElementById("m"+number).style.display = "none";
}

function save() {
    if(number<20)
    {
        var dataURL = document.getElementById('myCanvas').toDataURL();
        var merge = document.getElementById('can').getContext("2d");
        //background of handwriting
     	var bkg = new Image();
     	bkg.src = "./media/lined-paper.svg";
     	// bkg.crossOrigin = "anonymous";
     	// gender.crossOrigin = "anonymous";
        merge.drawImage(gender,0,0);
        merge.drawImage(bkg,25,360,300,185);
        merge.drawImage(canvas,25,350);
        ++number;
        document.getElementById("m"+number).src = document.getElementById('can').toDataURL();
        document.getElementById("m"+number).style.display = "inline-block";
        merge.clearRect(0, 0, merge.canvas.width, merge.canvas.height);
        if(number > 19)
        {
            $('#plus').attr("disabled",true);
        }
    }
}

function showdelete(){
    for(var i=1;i<number+1;i++)
    { 
        document.getElementById("d"+i).style.display = "inline-block";
        $('#plus').attr("disabled",true);
    }
}
function hidedelete(){
     for(var i=1;i<number+1;i++)
    { 
        document.getElementById("d"+i).style.display = "none";
        $('#plus').attr("disabled",false);
    }
}


function boy() {
    document.getElementById("girl").style.display = "none";
    document.getElementById("boy").width = "350";
    gender.src = document.getElementById("boy").src;
    document.getElementById("myCanvas").style.display = "inline-block";
    document.getElementById("eraser").style.display = "inline-block";
    document.getElementById("create").style.display = "block";
    // document.getElementById("can").onload=function(e){}
    InitThis();
    // initCanvas();
}

function girl() {
    document.getElementById("boy").style.display = "none";
    document.getElementById("girl").width = "350";
    gender.src = document.getElementById("girl").src;
    document.getElementById("myCanvas").style.display = "inline-block";
    document.getElementById("eraser").style.display = "inline-block";
    document.getElementById("create").style.display = "block";
    InitThis();
}

function twogrp() {
    $('.groups').attr("style","display:inline");
    $('.twogrp').attr("style","display:inline");
    $('.threegrp').attr("style","display:none");
    $('.fourgrp').attr("style","display:none");
}

function threegrp() {
    $('.groups').attr("style","display:inline");
    $('.threegrp').attr("style","display:inline");
    $('.twogrp').attr("style","display:none");
    $('.fourgrp').attr("style","display:none");
}

function fourgrp() {
    $('.groups').attr("style","display:inline");
    $('.fourgrp').attr("style","display:inline");
    $('.twogrp').attr("style","display:none");
    $('.threegrp').attr("style","display:none");
}


var deleteflag = false;
$(function() {
$(document).delegate('#minus', 'click', function(event) {
    if(number > 0){
        if(!deleteflag){
            showdelete();
            deleteflag = true;
        }
        else {
            hidedelete();
            deleteflag = false;
        }
    }     
})
})


$(function() {
$(document).delegate('.delete', 'click', function(event) {
    var index = $(this).attr("id");
    // console.log(index[1]);
    document.getElementById("d"+number).style.display = "none";
    document.getElementById("m"+number).style.display = "none";
    if(index.length == 2)
        ind = index[1];
    else
        ind = index[1]+index[2];    
    k = Number(ind);

    //hide delete button
    deleteflag=false;
    hidedelete();

    for(k;k<number;k++)
    {   
        var tmp1 = document.getElementById("m"+k).src;
        var tmp2 = document.getElementById("d"+k).src;
        document.getElementById("m"+k).src=document.getElementById("m"+(k+1)).src;
        document.getElementById("d"+k).src=document.getElementById("d"+(k+1)).src;
        document.getElementById("m"+(k+1)).src=tmp1;
        document.getElementById("d"+(k+1)).src=tmp2;
    }

    // console.log(k);

    --number;
    if(number < 20)
    {
        $('#plus').attr("disabled",false);
    }
})
})





$(function() {
$(document).delegate('#plus', 'click', function(event) {
        // window.onload = function(){initCanvas()},
        new top.PopLayer({
            "title": "",
            "content":
            "<img src='./media/boy.svg' id='boy' class='figure' width='200px'  onclick='boy()'> \
            <img src='./media/girl.svg' id='girl' class='figure' width='200px'  onclick='girl()'> \
            <br><canvas id='myCanvas' width='300px' height='175px' style='display:none'></canvas>\
            <button id='clr' onclick='erase()'><img id='eraser' src='./media/eraser.svg' width='25px' style='display:none'></button> \
            <div align='center'><button class='create' id='create' style='display:none' onclick='save()'> &nbsp;&nbsp; Create &nbsp;&nbsp; </button></div>"
    })

})
})


$(function() {
$(document).delegate('#team', 'click', function(event) {
        // window.onload = function(){initCanvas()},
        new top.PopLayer({
            "title": "",
            "content":
            "<img src='./media/g1.png' class='team' width='600px'  onclick='twogrp()'> \
            <img src='./media/g2.png'  class='team' width='600px'  onclick='threegrp()'> \
            <img src='./media/g3.png'  class='team' width='600px'  onclick='fourgrp()'>"
    })

})
})

// <canvas id='can' width='400' height='100' style='display:none'></canvas>
// <iframe id='can' src='draw.html' frameborder='0' scrolling='no' width='400' style='display:none'></iframe>\
// <image id='btn' src='media/plus.svg' width='30px' onclick='plus()'>\






//    <canvas id= 'myCanvas' width='500' height='200' style='border:2px solid black'></canvas><br/><br/>\
// <button onclick='javascript:clearArea();return false;'>Clear Area</button>\