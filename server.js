const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Proxy endpoint
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/58.0.3029.83 Mobile/14E304 Safari/602.1'
      }
    });
    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('.total_fob, .pager_box, .sort_box, .btn_style4, input[type="checkbox"], .jpy, #calculate_form, .searchStep2, #header_wrap').remove();
    $('#navi').remove();
    $('#popup_contact').remove();
    $('#popup_contact_err').remove();
    $('#popup_contact_comp').remove();
    $('#popup_offer_exist').remove();
    $('#popup_favorite_comp').remove();
    $('#footer_wrap').remove();
    $('.footer_pagetop').remove();
    $('.f_navi').remove();
    $('hr').remove();


    // Adding header directly using Cheerio
    $('#result_form').prepend(`

    <p style="margin: 0; font-size: 24px; font-weight: bold; text-align: center; color: #FFF; background-color: #0066CC;">Real Motor Japan</p>
    <br/>

    <div style="text-align: center; margin-bottom: 20px;">
      <a href="https://www.realmotor.jp/car_list/All/All/All/"><img src="https://i.imgur.com/AYOFblW.gif" style="max-width: 100%; border-radius: 10px;"></a>
    </div>
    
    <p style="margin: 0; font-size: 24px; font-weight: bold; text-align: center; color: #FFF; background-color: #0066CC;">How to Buy</p>
    <br/>

    <div style="text-align: center; margin-bottom: 20px;">
     <a href="https://www.realmotor.jp/howto_02"><img src="https://i.imgur.com/akXAGQ7.png" style="max-width: 100%; border-radius: 10px;"></a>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
    <a href="https://www.realmotor.jp/howto_02"><img src="https://i.imgur.com/pA7FTbO.png" style="max-width: 100%; border-radius: 10px;"></a>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
    <a href="https://www.realmotor.jp/howto_02"><img src="https://i.imgur.com/oYQJwHp.png" style="max-width: 100%; border-radius: 10px;"></a>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
    <a href="https://www.realmotor.jp/howto_02"><img src="https://i.imgur.com/s1GS2Lv.png" style="max-width: 100%; border-radius: 10px;"></a>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
    <a href="https://www.realmotor.jp/howto_02"><img src="https://i.imgur.com/B8dAEgl.png" style="max-width: 100%; border-radius: 10px;"></a>
    </div>

    <header style="background-color: white; padding: 0px; border-radius: 10px;">
      <p style="margin: 0px 0 0; font-weight: bold; font-size: 16px;">Dear Valued Customer,</p>
      <br/>
      <p style="margin: 0px 0 0; font-size: 16px;">We're excited to share that we have new vehicles available at Real Motor Japan! Take a look at our latest selection and find the car that's just right for you. We're here to help you every step of the way.</p>
      <br/>
      <p style="margin: 0; font-size: 24px; font-weight: bold; text-align: center; color: #FFF; background-color: #0066CC;">Latest Arrivals</p>
      </header>
`).css({
      'max-width': '500px',
      'padding': '10px',
      'margin': 'auto',
      'margin-top': '20px',
      'border': '1px solid #ddd',
      'border-radius': '4px',
      'box-shadow': '0 2px 4px rgba(0,0,0,.1)',
    });

    const currentYear = new Date().getFullYear();
    $('#result_form').append(`
    <table align="center" style="margin-top: 20px;">
    <tr>
      <td style="text-align: center;">
        <a href="https://www.facebook.com/RealMotorJP" style="text-decoration: none;">
          <img src="https://i.imgur.com/1n27A1H.png" style="height: 24px; width: 24px; margin-right: 10px;">
        </a>
      </td>
      <td style="text-align: center;">
        <a href="https://www.instagram.com/realmotorjp" style="text-decoration: none;">
          <img src="https://i.imgur.com/zGNBt8j.png" style="height: 24px; width: 24px;">
        </a>
      </td>
    </tr>
  </table>
<p style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
    © ${currentYear} Real Motor Japan (Yanagisawa HD. Co., LTD.). All rights reserved.<br>26-2 Takara Tsutsumi-cho, Toyota, Aichi, Japan
</p>
`);

    // Applying styles directly to elements
    // Note: This part might need adjustment since direct CSS manipulation like this might not work as expected. Consider sending style tags or classes.
    // $('#result_form').attr('style', 'max-width: 400px; margin: auto; margin-top: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,.1);');
    $('h1, h2, h3').attr('style', 'color: #333;');
    $('img').attr('style', 'max-width: 100%; height: auto;');
    $('.usd').attr('style', 'line-height: 1.6; color: #16A34A; font-size: 20px; font-weight: bold;');
    $('a').attr('style', 'color: #06c; font-size: 18px;');
    $('strong').attr('style', 'color: #FF0000;');
    $('.car_list_wrap').attr('style', 'margin: 10px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #F8F9FF; box-shadow: 0 2px 4px rgba(0,0,0,.1);');

    // Send modified HTML
    res.send($.html());
  } catch (error) {
    console.error('Error fetching external content:', error);
    res.status(500).send('Failed to fetch external content');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

