// Item Controller
const itemCtrl = (function(){
    const Item = function(id, name, calories){
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
    const data = {
      items: [],
      currentItem: null,
      totalCalories: 0
    }
  
    return {
      getItems: function(){
        return data.items;
      },
      addItem: function(name, calories){
        let ID;
        if(data.items.length > 0){
          ID = data.items[data.items.length - 1].id + 1;
        } else {
          ID = 0;
        }
        calories = parseInt(calories);
        newItem = new Item(ID, name, calories);
        data.items.push(newItem);
        return newItem;
      },
      getItemById: function(id){
        let found = null;
        data.items.forEach(function(item){
          if(item.id === id){
            found = item;
          }
        });
        return found;
      },
      updateItem: function(name, calories){
        calories = parseInt(calories);
        let found = null;
        data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
            item.name = name;
            item.calories = calories;
            found = item;
          }
        });
        return found;
      },
      setCurrentItem: function(item){
        data.currentItem = item;
      },
      getCurrentItem: function(){
        return data.currentItem;
      },
      getTotalCalories: function(){
        let total = 0;
        data.items.forEach(function(item){
          total += item.calories;
        });
        data.totalCalories = total;
        return data.totalCalories;
      },
      logData: function(){
        return data;
      }
    }
  })();
  
  
  
  // UI Controller
  const uiCtrl = (function(){
    const uiSelectors = {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
    }
    return {
      renderListItems: function(items){
        let html = '';
        items.forEach(function(item){
          html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
        });
        document.querySelector(uiSelectors.itemList).innerHTML = html;
      },
      getItemInput: function(){
        return {
          name:document.querySelector(uiSelectors.itemNameInput).value,
          calories:document.querySelector(uiSelectors.itemCaloriesInput).value
        }
      },
      addListItem: function(item){
        document.querySelector(uiSelectors.itemList).style.display = 'block';
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.id = `item-${item.id}`;
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', li)
      },
      updateListItem: function(item){
        let listItems = document.querySelectorAll(uiSelectors.listItems);
        listItems = Array.from(listItems);
        listItems.forEach(function(listItem){
          const itemID = listItem.getAttribute('id');
          if(itemID === `item-${item.id}`){
            document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
          }
        });
      },
      clearInput: function(){
        document.querySelector(uiSelectors.itemNameInput).value = '';
        document.querySelector(uiSelectors.itemCaloriesInput).value = '';
      },
      addItemToForm: function(){
        document.querySelector(uiSelectors.itemNameInput).value = itemCtrl.getCurrentItem().name;
        document.querySelector(uiSelectors.itemCaloriesInput).value = itemCtrl.getCurrentItem().calories;
        uiCtrl.showEditState();
      },
      hideList: function(){
        document.querySelector(uiSelectors.itemList).style.display = 'none';
      },
      showTotalCalories: function(totalCalories){
        document.querySelector(uiSelectors.totalCalories).textContent = totalCalories;
      },
      clearEditState: function(){
        uiCtrl.clearInput();
        document.querySelector(uiSelectors.updateBtn).style.display = 'none';
        document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
        document.querySelector(uiSelectors.backBtn).style.display = 'none';
        document.querySelector(uiSelectors.addBtn).style.display = 'inline';
      },
      showEditState: function(){
        document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
        document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
        document.querySelector(uiSelectors.backBtn).style.display = 'inline';
        document.querySelector(uiSelectors.addBtn).style.display = 'none';
      },
      getSelectors: function(){
        return uiSelectors;
      }
    }
  })();
  
  
  
  // App Controller
  const app = (function(itemCtrl, uiCtrl){
    const loadEventListeners = function(){
      const uiSelectors = uiCtrl.getSelectors();
      document.querySelector(uiSelectors.addBtn).addEventListener('click', addItemHandler);
      document.addEventListener('keypress', function(e){
        if(e.keyCode === 13){
          e.preventDefault();
          return false;
        }
      });
      document.querySelector(uiSelectors.itemList).addEventListener('click', editItemHandler);
      document.querySelector(uiSelectors.updateBtn).addEventListener('click', updateItemHandler);
    }

    const addItemHandler = function(e){
      const input = uiCtrl.getItemInput();
      if(input.name !== '' && input.calories !== ''){
        const newItem = itemCtrl.addItem(input.name, input.calories);
        uiCtrl.addListItem(newItem);
        const totalCalories = itemCtrl.getTotalCalories();
        uiCtrl.showTotalCalories(totalCalories);
        uiCtrl.clearInput();
      }
      e.preventDefault();
    }

    const editItemHandler = function(e){
      if(e.target.classList.contains('edit-item')){
        const listId = e.target.parentNode.parentNode.id;
        const listIdArr = listId.split('-');
        const id = parseInt(listIdArr[1]);
        const itemToEdit = itemCtrl.getItemById(id);
        itemCtrl.setCurrentItem(itemToEdit);
        uiCtrl.addItemToForm();
      }
      e.preventDefault();
    }
    const updateItemHandler = function(e){
      const input = uiCtrl.getItemInput();
      const updatedItem = itemCtrl.updateItem(input.name, input.calories);
      uiCtrl.updateListItem(updatedItem);
       const totalCalories = itemCtrl.getTotalCalories();
       uiCtrl.showTotalCalories(totalCalories);
       uiCtrl.clearEditState();
      e.preventDefault();
    }
    return {
      init: function(){
        uiCtrl.clearEditState();
        const items = itemCtrl.getItems();
        if(items.length === 0){
          uiCtrl.hideList();
        } else {
          uiCtrl.renderListItems(items);
        }
        const totalCalories = itemCtrl.getTotalCalories();
        uiCtrl.showTotalCalories(totalCalories);
        loadEventListeners();
      }
    }
    
  })(itemCtrl, uiCtrl);
  
  // Initialize App
  app.init();