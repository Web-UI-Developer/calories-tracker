// Item controller 
const itemCtrl = (function (){
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories =calories;
    }
const data = {
    items : [
        {id: 0, name: 'Cookie', calories: 200},
        {id: 1, name: 'Thai Food', calories: 250}
    ],
    currentItem  : null,
    totalCalories : 0
    }
    return {
        getItems : function () {
            return data.items;
        }
    }
})();

// UI Controller 
const uiCtrl = (function () {
    const uiSelector = {
        itemList = '#item-list'
    }
    return {
        populateItemList : function (items) {
            let html = '';
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                 <a href="#" class="secondary-content">
                     <i class="edit-item fa fa-pencil"></i>
                 </a>
            </li>`
            });
            document.querySelector(uiSelector.itemList).innerHTML = html;
        }
    }

})();

// App controller 
const app = (function (itemCtrl, uiCtrl){
    return {
        init: function () {
        const items = itemCtrl.getItems();
        uiCtrl.populateItemList(items);
        } 
    }
})(itemCtrl, uiCtrl);

App.init();