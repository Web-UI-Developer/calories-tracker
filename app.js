// Item controller 
const itemCtrl = (function (){
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories =calories;
    }
const data = {
    items : [],
    currentItem  : null,
    totalCalories : 0
    }
    return {
        getItems : function () {
            return data.items;
        },
        addItem : function (name, calories) {
            let id;
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }
            calories = parseInt(calories);
            newItem = new Item(id, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getTotalCal : function () {
            let total = 0;
            data.items.forEach(function (item){
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData : function () {
            return data;
        }
    }
})();

// UI Controller 
const uiCtrl = (function () {
    const uiSelector = {
        itemList : '#item-list',
        addBtn : '.add-btn',
        itemNameInput : '#item-name',
        itemCaloriesInput : '#item-calories',
        totalCal : '.total-colories',
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
        },
        getItemInputs : function () {
            return {
                name: document.querySelector(uiSelector.itemNameInput).value,
                calories: document.querySelector(uiSelector.itemCaloriesInput).value,
            }
        },
        addListItems : function (item) {
            document.querySelector(uiSelector.itemList).style.display = 'block';
            const li = document.createElement ('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(uiSelector.itemList).insertAdjacentElement('beforeend', li);
        },
        showTotalCal : function (totalCalories) {
            document.querySelector(uiSelector.totalCal).textContent = totalCalories;
        },
        clearInput : function () {
            document.querySelector(uiSelector.itemNameInput).value = '';
            document.querySelector(uiSelector.itemCaloriesInput).value = '';
        },
        hideUiEle : function () {
            document.querySelector(uiSelector.itemList).style.display = 'none';
        },
        getSelectors : function() {
            return uiSelector;
        }
    }

})();

// App controller 
const app = (function (itemCtrl, uiCtrl){
    const loadEventListener = function () {
    const uiSelector = uiCtrl.getSelectors();
    document.querySelector(uiSelector.addBtn).addEventListener('click', itemAddSubmit);
    }
    const itemAddSubmit = function (e){
        const input = uiCtrl.getItemInputs();
        if (input.name !== '' && input.calories !== ''){
            const newItem = itemCtrl.addItem(input.name, input.calories);
            uiCtrl.addListItems(newItem);
            const totalCalories = itemCtrl.getTotalCal();
            uiCtrl.showTotalCal(totalCalories);
            uiCtrl.clearInput();
        }
        e.preventDefault();
    }
    return {
        init: function () {
        const items = itemCtrl.getItems();
        if (items.length === 0) {
            uiCtrl.hideUiEle();
        } else {
            uiCtrl.populateItemList(items);
        }
        loadEventListener();
        } 
    }
})(itemCtrl, uiCtrl);

app.init();