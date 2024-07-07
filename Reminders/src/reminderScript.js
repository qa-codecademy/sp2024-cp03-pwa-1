const remindersList = document.getElementById('remindersList');
      const addReminderBtn = document.getElementById('addReminderBtn');
      const reminderTitle = document.getElementById('reminderTitle');
      const reminderDateTime = document.getElementById('reminderDateTime');
      const reminderDescription = document.getElementById('reminderDescription');

      // Load reminders from local storage
      let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

      // Function to render reminders
      function renderReminders() {
          remindersList.innerHTML = '';
          reminders.forEach((reminder, index) => {
              const listItem = document.createElement('li');
              listItem.className = 'reminder-item';

              const detailsDiv = document.createElement('div');
              detailsDiv.className = 'reminder-details';

              const title = document.createElement('h4');
              title.textContent = reminder.title;
              detailsDiv.appendChild(title);

              const dateTime = document.createElement('p');
              dateTime.textContent = new Date(reminder.dateTime).toLocaleString();
              detailsDiv.appendChild(dateTime);

              if (reminder.description) {
                  const description = document.createElement('p');
                  description.textContent = reminder.description;
                  detailsDiv.appendChild(description);
              }

              const actionsDiv = document.createElement('div');
              actionsDiv.className = 'reminder-actions';

              const editBtn = document.createElement('button');
              editBtn.textContent = 'Edit';
              editBtn.onclick = () => editReminder(index);
              actionsDiv.appendChild(editBtn);

              const deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'Delete';
              deleteBtn.onclick = () => deleteReminder(index);
              actionsDiv.appendChild(deleteBtn);

              listItem.appendChild(detailsDiv);
              listItem.appendChild(actionsDiv);

              remindersList.appendChild(listItem);
          });
      }

      // Function to add a new reminder
      function addReminder() {
          const title = reminderTitle.value.trim();
          const dateTime = reminderDateTime.value;
          const description = reminderDescription.value.trim();

          if (title && dateTime) {
              reminders.push({ title, dateTime, description });
              localStorage.setItem('reminders', JSON.stringify(reminders));
              renderReminders();
              reminderTitle.value = '';
              reminderDateTime.value = '';
              reminderDescription.value = '';
          } else {
              alert('Please fill in both the title and the date/time.');
          }
      }

      // Function to edit a reminder
      function editReminder(index) {
          const reminder = reminders[index];
          reminderTitle.value = reminder.title;
          reminderDateTime.value = reminder.dateTime;
          reminderDescription.value = reminder.description;
          addReminderBtn.textContent = 'Update Reminder';
          addReminderBtn.onclick = () => updateReminder(index);
      }

      // Function to update a reminder
      function updateReminder(index) {
          const title = reminderTitle.value.trim();
          const dateTime = reminderDateTime.value;
          const description = reminderDescription.value.trim();

          if (title && dateTime) {
              reminders[index] = { title, dateTime, description };
              localStorage.setItem('reminders', JSON.stringify(reminders));
              renderReminders();
              reminderTitle.value = '';
              reminderDateTime.value = '';
              reminderDescription.value = '';
              addReminderBtn.textContent = 'Add Reminder';
              addReminderBtn.onclick = addReminder;
          } else {
              alert('Please fill in both the title and the date/time.');
          }
      }

      // Function to delete a reminder
      function deleteReminder(index) {
          reminders.splice(index, 1);
          localStorage.setItem('reminders', JSON.stringify(reminders));
          renderReminders();
      }

      // Event listener for adding a reminder
      addReminderBtn.addEventListener('click', addReminder);

      // Initial render
      renderReminders();