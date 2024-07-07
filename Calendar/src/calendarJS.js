const calendarTable = document.getElementById('calendarTable');
      const monthYearDisplay = document.getElementById('monthYear');
      const prevMonthBtn = document.getElementById('prevMonth');
      const nextMonthBtn = document.getElementById('nextMonth');
      const taskInput = document.getElementById('taskInput');
      const addTaskBtn = document.getElementById('addTaskBtn');

      let currentDate = new Date();
      let tasks = {};

      function updateCalendar() {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          // Update header
          monthYearDisplay.textContent = currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
          });

          // Clear previous cells
          calendarTable.querySelector('tbody').innerHTML = '';

          // Create date cells
          let date = 1;
          for (let i = 0; i < 6; i++) { // Create 6 weeks
              const row = document.createElement('tr');

              for (let j = 0; j < 7; j++) {
                  const cell = document.createElement('td');

                  if (i === 0 && j < firstDay) {
                      cell.innerHTML = '';
                  } else if (date > daysInMonth) {
                      cell.innerHTML = '';
                  } else {
                      cell.textContent = date;
                      const dayTasks = tasks[`${year}-${month + 1}-${date}`] || [];
                      const taskList = document.createElement('ul');
                      taskList.classList.add('task-list');

                      dayTasks.forEach(task => {
                          const taskItem = document.createElement('li');
                          taskItem.textContent = task;
                          taskList.appendChild(taskItem);
                      });

                      cell.appendChild(taskList);

                      if (date === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
                          cell.classList.add('today');
                      }

                      cell.addEventListener('click', () => {
                          const selectedDate = `${year}-${month + 1}-${date}`;
                          addTask(selectedDate);
                      });

                      date++;
                  }

                  row.appendChild(cell);
              }

              calendarTable.querySelector('tbody').appendChild(row);
          }
      }

      function addTask(selectedDate) {
          const task = taskInput.value.trim();
          if (task) {
              if (!tasks[selectedDate]) {
                  tasks[selectedDate] = [];
              }
              tasks[selectedDate].push(task);
              taskInput.value = '';
              updateCalendar();
          }
      }

      prevMonthBtn.addEventListener('click', () => {
          currentDate.setMonth(currentDate.getMonth() - 1);
          updateCalendar();
      });

      nextMonthBtn.addEventListener('click', () => {
          currentDate.setMonth(currentDate.getMonth() + 1);
          updateCalendar();
      });

      addTaskBtn.addEventListener('click', () => {
          const selectedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${new Date().getDate()}`;
          addTask(selectedDate);
      });

      // Initial load
      updateCalendar();