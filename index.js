const express = require('express');//Set up the express module
const app = express();
const router = express.Router();
const path = require('path')//Include the Path module
const axios = require('axios')

function generateQueryParams(tweetID, cursor = '') {
  let variables = {
      "focalTweetId": tweetID,
      "referrer": "profile",
      "controller_data": "DAACDAABDAABCgABAAAAAAAAAAAKAAkJ6UialhbwAAAAAAA=",
      "with_rux_injections": false,
      "includePromotedContent": true,
      "withCommunity": true,
      "withQuickPromoteEligibilityTweetFields": true,
      "withBirdwatchNotes": true,
      "withVoice": true,
      "withV2Timeline": true
  }
  if (cursor != 'start') {
      variables.cursor = cursor
      variables.referrer = 'tweet'
  }
  const features = {
      "responsive_web_graphql_exclude_directive_enabled": true,
      "verified_phone_label_enabled": false,
      "responsive_web_home_pinned_timelines_enabled": true,
      "creator_subscriptions_tweet_preview_api_enabled": true,
      "responsive_web_graphql_timeline_navigation_enabled": true,
      "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
      "c9s_tweet_anatomy_moderator_badge_enabled": true,
      "tweetypie_unmention_optimization_enabled": true,
      "responsive_web_edit_tweet_api_enabled": true,
      "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
      "view_counts_everywhere_api_enabled": true,
      "longform_notetweets_consumption_enabled": true,
      "responsive_web_twitter_article_tweet_consumption_enabled": false,
      "tweet_awards_web_tipping_enabled": false,
      "freedom_of_speech_not_reach_fetch_enabled": true,
      "standardized_nudges_misinfo": true,
      "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
      "longform_notetweets_rich_text_read_enabled": true,
      "longform_notetweets_inline_media_enabled": true,
      "responsive_web_media_download_video_enabled": false,
      "responsive_web_enhance_cards_enabled": false
  }
  const fieldToggles = { "withArticleRichContentState": false }
  const queryParams = 'variables=' + encodeURIComponent(JSON.stringify(variables)) + '&features=' + encodeURIComponent(JSON.stringify(features)) + '&fieldToggles=' + encodeURIComponent(JSON.stringify(fieldToggles))
  return queryParams
}
async function fetchTweet(tweetID) {
  let headers = {
      'authority': 'twitter.com',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'cookie': '_ga=GA1.2.1843628141.1697261972; _gid=GA1.2.422162928.1697261972; kdt=Cult0Zv23TKQsrvm3yUxrKUQZRRu6uRI633WHxRB; lang=en; auth_multi="1446653787603542016:597502e91763a4d32bbcb47527c37e691e94ad65"; auth_token=eafef5d6d89e965b7900e775fa40d7d5d1827ef9; guest_id_ads=v1%3A169796601472717369; guest_id_marketing=v1%3A169796601472717369; guest_id=v1%3A169796601472717369; twid=u%3D714181844695183360; ct0=4ee929a4dfc1e3a6dea2c806a1cde4096a57c2e85e379530b22df13862a40c3e16cc1a165cb2c5357d047a419a3efd2c326abedcb13deaa4c856de002bd2af9200dd6308e9161f8d84a61d1312f65c29; personalization_id="v1_ERk6dRvLNXFAWtfGl+FCgg=="; guest_id=v1%3A169745400312965772; guest_id_ads=v1%3A169745400312965772; guest_id_marketing=v1%3A169745400312965772; personalization_id="v1_Oe97YRmplV4BJisXtq5uTw=="',
      'pragma': 'no-cache',
      'referer': 'https://twitter.com/leductam2003/status/1715771579349758434',
      'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      'x-client-transaction-id': 'OFW/kDmd7MZbn0A9F38JQIy6SuNq3UwUjq5AZLY47YxnCRbEdffcizf+MRGmQPWDt2K83TiMBT7zXpzOWlxRyQ4CavgROQ',
      'x-csrf-token': '4ee929a4dfc1e3a6dea2c806a1cde4096a57c2e85e379530b22df13862a40c3e16cc1a165cb2c5357d047a419a3efd2c326abedcb13deaa4c856de002bd2af9200dd6308e9161f8d84a61d1312f65c29',
      'x-twitter-active-user': 'no',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-client-language': 'en'
  }
  let cursor = '';
  let haveToNextPage = true
  let usernames = []
  while (haveToNextPage) {
      const queryParams = generateQueryParams(tweetID,cursor)
      const response = await axios.get(`https://twitter.com/i/api/graphql/BbmLpxKh8rX8LNe2LhVujA/TweetDetail?${queryParams}`, {headers: headers});
      if (response.status == 200) {
          const entries = response.data.data.threaded_conversation_with_injections_v2.instructions[0].entries
          for (const entry of entries) {
              if (entry.content.entryType === 'TimelineTimelineModule') {
                if ('core' in entry.content.items[0].item.itemContent.tweet_results.result) {
                    const username = entry.content.items[0].item.itemContent.tweet_results.result.core.user_results.result.legacy.screen_name
                    usernames.push(username)
                }
              }
              if ('itemContent' in entry.content && entry.content.itemContent.itemType === 'TimelineTimelineCursor') {
                  haveToNextPage = true
                  cursor = entry.content.itemContent.value
              }else{
                  haveToNextPage = false
              }
          }
      }
  }
  return usernames
}
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.use('/', router);

router.get('/check.js', function(req, res) {
  res.sendFile(path.join(__dirname, '/check.js'));
});

app.get('/twitter_details', async (req, res) => {
  try {
    const tweetID = req.query.tweetID;
    const usernames = await fetchTweet(tweetID);
    res.json({ usernames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching Twitter details' });
  }
});

app.use(function(req, res, next) {
  res.status(404);
  res.sendFile(__dirname + '/404.html');
});

let server = app.listen(3000, function() {
  console.log("App server is running on port 3000");
});