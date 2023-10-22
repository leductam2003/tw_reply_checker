function filterLinks() {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const text = document.getElementById('tweet_links').value
    const urls = text.match(urlRegex);
    let tweets = []
    if (urls) {
        urls.forEach((url) => {
            tweets.push(url)
        });
    } else {
        console.log("No URLs found in the text.");
    }
    document.getElementById('tweet_links').value = tweets.join('\n')
    document.getElementById('total-tweets').innerHTML = `Total: ${tweets.length}`
}
function eraseTextArea() {
    document.getElementById('tweet_links').value = ''
    document.getElementById('your_tweet_link').value = ''
    document.getElementById('total-tweets').innerHTML = `Total: ...`
    document.getElementById('already_reply').value = ``
    document.getElementById('not_reply').value = ``
    document.getElementById('total-not-reply').innerHTML = `Total: ...`
    document.getElementById('total-reply').innerHTML = `Total: ...`
}

async function startCheck() {
    document.getElementById('bot-status').innerHTML = `Checking...`
    document.getElementById('already_reply').value = ``
    document.getElementById('not_reply').value = ``
    document.getElementById('total-not-reply').innerHTML = `Total: ...`
    document.getElementById('total-reply').innerHTML = `Total: ...`
    const interacts = document.getElementById('tweet_links').value.trim().split('\n');
    const tweetID = document.getElementById('your_tweet_link').value.trim().match(/[0-9]{19}/)[0]
    console.log(window.location.host)
    const total_username_reply = (await axios.get('http://' +window.location.host + '/twitter_details?tweetID=' + tweetID)).data.usernames.map(e => { return e.toLowerCase() })
    console.log(total_username_reply.join(','))
    let user_reply = []
    let user_not_reply = []
    for (const i of interacts) {
        const regex = /(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)/;
        const match = i.match(regex);
        const username = match[1].toLowerCase();
        if (total_username_reply.includes(username)) {
            console.log(`user: ${username} already interact`)
            updateTextarea('already_reply', username)
            user_reply.push(username)
        } else {
            updateTextarea('not_reply', username)
            console.log(`user: ${username} not interact`)
            user_not_reply.push(username)
        }
    }
    const total = document.getElementById('total-tweets').innerHTML.match(/\d+/)[0]
    document.getElementById('total-reply').innerHTML = `Total: ${user_reply.length}/${total} | ${(user_reply.length/total*100).toFixed(2)}%`
    document.getElementById('total-not-reply').innerHTML = `Total: ${user_not_reply.length}/${total} | ${(user_not_reply.length/total*100).toFixed(2)}%`
    document.getElementById('bot-status').innerHTML = `...`
}

function updateTextarea(textAreaId, message) {
    var textarea = document.getElementById(textAreaId);
    var oldContent = textarea.value;
    if (oldContent !== "") {
        message = '\n' + message;
    }
    var updatedContent = oldContent + message;
    textarea.value = updatedContent;
}