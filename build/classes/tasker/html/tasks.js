(function($){
    window.mapHash = {
        isOpen: false,
        isFOpen: false,
        isMode: false,
        items: []
    };
    $(document).ready(function(){
        var container = $("#tasks-container"),
            openButton = $("#open-button"),
            wrapper = $("#wrapper"),
            newTaskContainer = $(".container-new-task"),
            bFind = $("#b-find"),
            newTask = $("#new-task"),
            newTaskWindow = $('#new-task-window'),
            b_ntw_cancel = $('#ntw-cancel'),
            b_ntw_add = $('#ntw-add'),
            input = $('#ntw-input'),
            textarea = $('#ntw-textarea'),
            tasksWrapper = $('#item-container'),
            mode = $('#mode-of-counting'),
            b_showTheWay = $('#show-the-way');

        window.mapHash.find = $("#find");
        function closeTasks() {
            if (window.mapHash.isOpen) {
                window.mapHash.isOpen = false;
                wrapper.css('display', 'none');
            }
        }
        
        function closeNewTask(){
            if (window.mapHash.isFOpen) {
                window.mapHash.isFOpen = false;
                window.mapHash.find.val('');
                window.mapHash.find.css('display', 'none');
                bFind.css('display', 'none');
                newTaskContainer.css('width', '30px');
                newTask.removeClass('open');
                hideNewLoactionMarker();
            }
        }

        openButton.on('click', function() {
            if (window.mapHash.isOpen) {
                closeTasks();
            } else {
                if (tasks.length > 0) {
                    window.mapHash.isOpen = true;
                    wrapper.css('display', 'block');
                }
                closeNewTask();
            }
            return false;
        });
        newTask.on('click', function() {
            if (window.mapHash.isFOpen) {
                closeNewTask();
            } else {
                window.mapHash.isFOpen = true;
                window.mapHash.find.css('display', 'inline');
                bFind.css('display', 'block');
                newTaskContainer.css('width', '400px');
                newTask.addClass('open');
                closeTasks();
            }
            return false;
        });
        
        function findLocation() {
            if ('' !== $.trim(window.mapHash.find.val())) {
                findAddress();
            }
        }
        
        window.mapHash.find.on('keydown', function(e){
            if (13 === e.keyCode) {
                findLocation();
            }
        });
        
        bFind.on('click', function() {
            findLocation();
        });
        
        window.mapHash.openNewTaskWindow = function(desc) {
            textarea.val(desc || '');
            newTaskWindow.css('display', 'inline-block');
        };
        
        b_ntw_cancel.on('click', function(e){
            e.preventDefault();
            input.val('');
            textarea.val('');
            newTaskWindow.css('display', 'none');
            return false;
        });
        b_ntw_add.on('click', function(e) {
            var title, description;
            e.preventDefault();
            title = $.trim(input.val());
            description = $.trim(textarea.val());
            if ('' !== title && '' !== description) {
                createNewTask(title, description);
                input.val('');
                textarea.val('');
                newTaskWindow.css('display', 'none');
            }
            return false;
        });
        
        window.mapHash.newTaskNode = function(id, name) {
            var item = $('<div>'),
                nWrapper = $('<div>'),
                bRemove = $('<button>');
            
            item.attr('id', id);
            item.addClass('item');
            nWrapper.addClass('item-name');
            nWrapper[0].innerHTML = name;
            bRemove.addClass('item-remove');
            
            nWrapper.on('click', function(e) {
                var _item = $(e.target).parent(); 
                e.preventDefault();
                setCenter(parseInt(_item.attr('id')));
                return false;
            });
            
            bRemove.on('click', function(e) {
                var _item = $(e.target).parent();
                e.preventDefault();
                removeTask(parseInt(_item.attr('id')), _item);
                _item.remove();
                if (tasks.length === 0) {
                    closeTasks();
                }
                return false;
            });
            
            item.append(nWrapper[0]);
            item.append(bRemove[0]);
            window.mapHash.items.push(item);
            tasksWrapper.append(item[0]);
            closeNewTask();
        };
        
        mode.on('click', function(e) {
            e.preventDefault();
            removePolyline();
            if (window.mapHash.isMode) {
                window.mapHash.isMode = false;
                b_showTheWay.css('display', '');
                mode.removeClass('mode-is-active');
                container.css('display', '');
                newTaskContainer.css('display', '');
            } else {
                window.mapHash.isMode = true;
                b_showTheWay.css('display', 'block');
                mode.addClass('mode-is-active');
                if (window.mapHash.isFOpen) {
                    closeNewTask();
                }
                if (window.mapHash.isOpen) {
                    closeTasks();
                }
                container.css('display', 'none');
                newTaskContainer.css('display', 'none');
            }
            switchMode(window.mapHash.isMode);
            return false;
        });
        b_showTheWay.on('click', function(e) {
            e.preventDefault();
            findWay();
            return false;
        });
    });
})(jQuery);


