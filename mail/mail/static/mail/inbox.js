document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);
  
    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {
    
    // Show compose view and hide other views
    document.querySelector('#page-title').style.display = 'none';
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#email-view').style.display = 'none';

    // Submit email
    const formel = document.querySelector('form')
    formel.addEventListener('submit', () => {

        const composeData = new FormData(formel);

        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
            recipients: composeData.get('recipient'),
            subject: composeData.get('subject'),
            body: composeData.get('body')
            })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result)
        });

        load_mailbox('sent')
    
    });
    
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
  
    // Show the mailbox name
    document.querySelector('#page-title').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    // Display SENT emails
    if (mailbox === 'sent')  {

        // Clear out inbox field DOES NOT WORK NOW I DONT JNOW WHY
        document.querySelector('#emails-view').innerHTML = '';

        // Fetch email
        fetch('/emails/sent')
        .then(response => response.json())
        .then(emails => {
            // Print emails
            console.log(emails);
    
            emails.forEach(display);
    
            function display(item) {

                const email = document.createElement('div');
                email.className = 'form-group';

                const subject = document.createElement('p');
                const sender = document.createElement('p');
                const time = document.createElement('p');

                subject.innerHTML = item['subject'];
                sender.innerHTML = item['sender'];
                time.innerHTML = item['timestamp'];

                if (item['read'] == false) {
                    email.style.backgroundColor = 'white';
                }

                else if (item['read'] == true) {
                    email.style.backgroundColor = '#F5F5F5';
                };

                email.innerHTML = '<div>' + '<b>' + sender.innerHTML + '</b>' + '</div>' + '<div>' + subject.innerHTML  + '</div> <i>' + time.innerHTML + '</i>';
                email.addEventListener('click', function() {

                    //read logic
                    id = item['id'];
                    fetch(`/emails/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            read: true
                        })
                    });

                    load_email(id);

                });
                document.querySelector('#emails-view').prepend(email);
            }
        });

    }

    // Display INBOX emails
    else if (mailbox === 'inbox')  {

        // Clear out inbox field
        document.querySelector('#emails-view').innerHTML = '';

        // Fetch email
        fetch('/emails/inbox')
        .then(response => response.json())
        .then(emails => {

            // Print emails
            console.log(emails);
    
            emails.forEach(display);
    
            function display(item) {

                const email = document.createElement('div');
                email.className = 'form-group';

                const subject = document.createElement("p");
                const sender = document.createElement("p");
                const time = document.createElement("p");

                subject.innerHTML = item['subject'];
                sender.innerHTML = item['sender'];
                time.innerHTML = item['timestamp'];

                if (item['read'] == false) {
                    email.style.backgroundColor = 'white';
                }

                else if (item['read'] == true) {
                    email.style.backgroundColor = '#F5F5F5';
                };

                email.innerHTML = '<div>' + '<b>' + sender.innerHTML + '</b>' + '</div>' + '<div>' + subject.innerHTML  + '</div> <i>' + time.innerHTML + '</i>';

                email.addEventListener('click', function() {

                    //read logic
                    id = item['id'];
                    fetch(`/emails/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            read: true
                        })
                    });

                    load_email(id);

                });
                document.querySelector('#emails-view').prepend(email);
            }
        });

    }

    //Display ARCHIVED emails
    else if (mailbox === 'archive') {
        
        // Clear out inbox field
        document.querySelector('#emails-view').innerHTML = '';
        
        // Fetch email
        fetch('/emails/archive')
        .then(response => response.json())
        .then(emails => {

            // Print emails
            console.log(emails);
    
            emails.forEach(display);
    
            function display(item) {

                const email = document.createElement('div');
                email.className = 'form-group';

                const subject = document.createElement('p');
                const sender = document.createElement('p');
                const time = document.createElement('p');

                subject.innerHTML = item['subject'];
                sender.innerHTML = item['sender'];
                time.innerHTML = item['timestamp'];

                if (item['read'] == false) {
                    email.style.backgroundColor = 'white';
                }

                else if (item['read'] == true) {
                    email.style.backgroundColor = '#F5F5F5';
                };

                email.innerHTML = '<div>' + '<b>' + sender.innerHTML + '</b>' + '</div>' + '<div>' + subject.innerHTML  + '</div> <i>' + time.innerHTML + '</i>';
                email.addEventListener('click', function() {
                    
                    //read logic
                    id = item['id']
                    fetch(`/emails/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            read: true
                        })
                    });

                    load_email(id);
                });
                document.querySelector('#emails-view').prepend(email);
            }
        });

    }
}

function load_email(id) {

    // Clear out email field
    document.querySelector('#email-sender-time').innerHTML = '';
    document.querySelector('#email-subject').innerHTML = '';   
    document.querySelector('#email-body').innerHTML = '';       

    //Show only one email
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';

    //Fetch certain email by its id
    fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
        // Print email      
        console.log(email);

        //Fill email data
        const sender_time = document.createElement('div');
        sender_time.innerHTML = 'From: ' + email['sender'] + "<br>" + 'On ' + email['timestamp'] + ' ';
        document.querySelector('#email-sender-time').prepend(sender_time);

        const subject = document.createElement('div');
        subject.innerHTML = email['subject'];
        document.querySelector('#email-subject').prepend(subject);

        const body = document.createElement('div');
        subject.innerHTML = email['body'];
        document.querySelector('#email-body').prepend(body);

        //reply button
        reply = document.querySelector('#reply');
        reply.addEventListener('click', function() {

            compose_email();

            re_recipient = document.querySelector('#compose-recipients');
            re_subject = document.querySelector('#compose-subject');
            re_body = document.querySelector('#compose-body');

            re_recipient.value = email['sender'];
            re_subject.value = 'Re: ' + email['subject'];
            re_body.value = 'On ' + email['timestamp'] + email['sender'] + ' wrote: ' + email['body'];

        });

        //archive logic
        archive = document.querySelector('#archive');
        archive.addEventListener('click', function() {
            fetch(`/emails/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    archived: true
                })
            });

            load_mailbox('inbox');
            location.reload();
        });

        //unarchive logic
        unarchive = document.querySelector('#unarchive');
        unarchive.addEventListener('click', function() {
            fetch(`/emails/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    archived: false
                })
            });

            load_mailbox('inbox');
            location.reload();
        });

        //Display archive or unarchive button
        if (email['archived'] === false) {
            document.querySelector('#unarchive').style.display = 'none';
        }

        else if (email['archived'] === true) {
            document.querySelector('#archive').style.display = 'none';
        };


        // ... do something else with email ...
    });

    


}