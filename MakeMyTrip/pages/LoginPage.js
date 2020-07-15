import {Selector,t} from 'testcafe'

class LoginPage
{
    //Page locators
    constructor()
    {
        this.loginPrompt=Selector('p').withExactText('Login or Create Account')

        this.loginPromptHeader=Selector('span').withExactText('Login/Signup')
        this.usernameInput=Selector('#username')
        this.passwordInput=Selector('#password')
        this.continueInput=Selector('button[data-cy="continueBtn"]')
        this.loginBtn=Selector('button[data-cy="login"]')
        this.infoPopup=Selector('div.autopop__wrap')
        this.infoPopup_EmailLogin=Selector('.rightArrow.pushRight')
        this.closeVerifyPhonePopup=Selector('span[data-cy="modalClose"]')

        this.loggedInUsername=Selector('p[data-cy="loggedInUser"]')
    }
    
    //Page methods

    async userLogin(userName,userPassword)
    {
        await t.typeText(this.usernameInput,userName,{paste:true,replace:true})
        await t.click(this.continueInput)
        await t.typeText(this.passwordInput,userPassword,{paste:true,replace:true})
        await t.click(this.loginBtn)
        await t.click(this.closeVerifyPhonePopup)
    }

    async openLoginPrompt()
    {
        let flag=await this.infoPopup.exists
        try
        {
            if(flag)
           {
             await t.click(this.infoPopup_EmailLogin)
           }
            else
           {
             await t.click(this.loginPrompt)
           }
        }
        catch(err)
        {
                await t.click(this.loginPrompt)
        }   
    } 
}

export default LoginPage