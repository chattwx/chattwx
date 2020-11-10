const fetch = require('node-fetch');

const postForecast = ({ webhook_url, forecast, avatar_url, thumbnail_url, color, title, embed_url }) => {
  const body = JSON.stringify({
    avatar_url,

    embeds: [
      {
        color,
        title,
        url: embed_url,

        thumbnail: {
          url: thumbnail_url,
        },

        description: forecast,
      },
    ],
  });

  return fetch(webhook_url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
};

module.exports = { postForecast };
