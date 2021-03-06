import puppeteer from "puppeteer";

export class BookService {
  constructor(url, dateIn, dateOut, adults, children) {
    this.url = url;
    this.dateIn = dateIn;
    this.dateOut = dateOut;
    this.adults = adults;
    this.children = children;
    this.browser = null;
    this.page = null;
  }
  async loadWebsite() {
    try{
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(this.url);
      this.page = page;
      this.browser = browser;
   
      
    } catch(error){
      console.log(error)
    }
   
  }

  getPage(){
    return this.page
  }

  getBrowser(){
    return this.browser
  }

  setPage(page) {
    this.page = page;
  }

  async book() {
    try {
      await this.loadWebsite();
      await this.checkInSelector(this.page, this.dateIn);
      await this.checkOutSelector(this.page, this.dateOut);
      await this.guestsAdultSelector(this.page, this.adults);
      await this.guestsChildrenSelector(this.page, this.children);
      await this.confirmBook(this.page);
    } catch (error) {
      this.browser.close()
      console.log("Ops ! It seems it is not the right URL")
      return "Ops ! It seems it is not the right URL";
    }
  }

  async checkInSelector(page, dateIn) {
  
    await page.waitForSelector("input.check-in-datepicker",{waitUntil: 'load', timeout: 8000});
    await page.waitForSelector("input.check-out-datepicker");
    await page.focus("input.check-in-datepicker");
    await page.keyboard.type(dateIn, { delay: 100 });
    await page.keyboard.press("Enter");
   
    
  }

  async checkOutSelector(page, dateOut) {
    await page.click("input.check-out-datepicker", { delay: 110 });
    await page.focus("input.check-out-datepicker");
    await page.click("input.check-out-datepicker", { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.keyboard.type(dateOut, { delay: 200 });
    await page.keyboard.press("Enter");
  }

  async guestsAdultSelector(page, numAdults) {
    await page.type("select#adults", numAdults, { delay: 400 });
  }

  async guestsChildrenSelector(page, numChildren) {
    await page.type("select#children", numChildren, { delay: 500 });
  }

  async confirmBook(page) {
    const [button] = await page.$x(
      '//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[2]/div/p/a'
    );
    await button.click();
  }

  
}

export default BookService

