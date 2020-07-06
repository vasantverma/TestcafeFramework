import { t, Selector } from 'testcafe';
import LoginPage from '../pages/LoginPage';
import config from '../config-files/config';

//Creating object
const loginPage=new LoginPage();

fixture `LoginPageTest`
       .page `https://www.makemytrip.com/`
       .beforeEach(async t=>{
          await t
                  .setTestSpeed(0.3) 
                  .setPageLoadTimeout(0)
                  .maximizeWindow()
          await loginPage.openLoginPrompt()
          await loginPage.userLogin(config.username,config.password)
                 
       });

   test('Verify that user is on Search flight page after login',async t =>{
        await t.expect(loginPage.loggedInUsername.innerText).eql('Hey'+config.firstname)
        await t.takeScreenshot({fullPage:true})
   })