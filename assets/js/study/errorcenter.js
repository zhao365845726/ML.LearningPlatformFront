var errorCenterQuestions = {
    init : function(info) {
        this.next_index = 0;
        this.yesAnswers = '';
        this.yesData = [];//正确答案id
        this.zoomArr = [];
        this.questionData = [];
        this.data = info.data;
        this.tpquestions(this.data);
    },
    tpquestions:function(data){
       for(var i=0;i<data.length;i++){
           data[i].order = i+1;
        }
        this.questionData = data;
        this.initquestions(this.questionData[0]);
    },
    initquestions:function(data){
        if(data){
            var selectCon = '';
            switch (data.veqdEntity.QuestionType){
                case 1:
                    selectCon = '<i>单选</i>';
                    break;
                case 2:
                    selectCon = '<i>多选</i>';
                    break;
                case 3:
                    selectCon = '<i>判断</i>';
                    break;
                }
        
            var title = '<div class="example">'+selectCon+'<span><strong>'+data.order+'.</strong>'+data.veqdEntity.QuestionTitle+'</span></div>';
            var orderA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            var orderCon = '';
            this.yesAnswers = '';
            this.yesData = [];
            this.zoomArr = [];
            var that = this;
            var buttonName = '';
            if(data.order == this.questionData.length){
                buttonName = '最后一题';
            }else{
                buttonName = '下一题';
            }

            $.each(data.lst_tqquestionoptions, function(index, item){
                 if(item.IsAnswer){
                        that.yesAnswers += orderA[index]+',';
                        that.yesData.push(orderA[index]);
                    }
                orderCon += '<li data-id="'+item.Id+'"><label for="answer_a" class="cursor"><b>'+orderA[index]+'</b><span>'+item.OptionName+'</span></label></li>';
            });
            that.yesAnswers = that.yesAnswers.slice(0,-1);
            orderCon = '<ul class="container example_answer">'+orderCon+'</ul>';
            var zoomCom = '<li class="eqquestionsList" data-id="'+data.veqdEntity.QuestionId+'" data-num="'+data.order+'" data-type="'+data.veqdEntity.QuestionType+'">'+title+orderCon+'<div class="container example_analysis displayNone"><p class="analysis1">正确答案：<b class="example_analysis_show">'+that.yesAnswers+'</b></p></div>'+'<div class="container example_btn"><div class="example_show cursor" style="display: block;">'+buttonName+'</div></div>'+'</li>';
            $('.errorCenterQuestion').html(zoomCom);
            this.selectAnswer();
            this.next();
        }else{
            $('.errorCenterQuestion').html('');
        }
    },
    selectAnswer:function(){
        var ele = $('.eqquestionsList label');
        var that = this;
        ele && ele.length > 0 && $.each(ele, function(index, item) {
            var _t = this;
            $(_t).on('click', function () {
                var type = $(".eqquestionsList").attr('data-type');
                if($(_t).hasClass('checked')){
                    $(_t).removeClass('checked');
                }else{
                    if(type == 1 || type == 3){
                        ele.removeClass('checked');
                    }
                    $(_t).addClass('checked');
                }
               /*记录答案*/
                that.writeAnswer();
            })
        })
    },
    writeAnswer:function(){
        var that = this;
        var cheaked = $('.eqquestionsList label.checked');
        that.zoomArr = [];
        cheaked.length > 0 && $.each(cheaked, function(index, item) {
            var myselectcon =  $(item).find('b').html();
            that.zoomArr.push(myselectcon);
        })
    },
    next:function(){
        var that = this;
        $(".example_show").click(function(){
            if(that.yesData.sort().toString() == that.zoomArr.sort().toString()){
                var userId = $.cookie('userId');
                var questionId = $(".eqquestionsList").attr('data-id');
                var questionNum = $(".eqquestionsList").attr('data-num');
                that.next_index++;
                if(that.next_index < that.questionData.length){
                    that.initquestions(that.questionData[that.next_index]);
                }else{
                    that.next_index = that.questionData.length-1;
                }
                $.ajax({
                    type: 'POST',
                    data: {'UserId':userId,'QuestionId':questionId},
                    url: ajaxUrl()+'deleteerrordata',
                    dataType: 'json',
                    crossDomain: true == !(document.all),
                    success: function(res) {
                        if(questionNum == that.questionData.length){
                             alert("错题练习已完成！");
                            $(".errorCenterQuestion").html('');
                        }
                    }
                })
               
            }else{
                $(".example_analysis").show();
            }
            
        })
    }
}

