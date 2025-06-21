const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });

  console.log('🔐 Faça login manualmente e pressione Enter no terminal quando estiver logado.');

  await new Promise(resolve => {
    process.stdin.resume();
    process.stdin.once('data', resolve);
  });

  await page.goto('https://www.facebook.com/me/friends', { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 5000));

  await autoScroll(page);

async function autoScroll(page){
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

  const friendMenuButtons = await page.$$(`i.x1b0d499.xep6ejk`);

  console.log(`🔍 Encontrados ${friendMenuButtons.length} botões de amizade na tela.`);

  const limit = Math.min(friendMenuButtons.length, 50);

  for (let i = 0; i < limit; i++) {
    try {
      const icon = friendMenuButtons[i];

      
      const bgPosition = await icon.evaluate(el => window.getComputedStyle(el).backgroundPosition);
      if (bgPosition !== '0px -75px') {
        console.log(`⏭️ Ignorando botão ${i + 1} com background-position: ${bgPosition}`);
        continue;
      }

      const parentBtn = await icon.evaluateHandle(el => {
        let current = el;
        while (current && current !== document.body) {
          if (
            current.tagName === 'BUTTON' ||
            current.getAttribute('role') === 'button' ||
            current.onclick ||
            current.classList.contains('clickable')
          ) {
            return current;
          }
          current = current.parentElement;
        }
        return null;
      });

      if (!parentBtn) {
        console.log(`⚠️ Não achou botão pai para o amigo ${i + 1}`);
        continue;
      }

      await parentBtn.click();
      await new Promise(resolve => setTimeout(resolve, 1500));

      const menuItems = await page.$$('[role="menuitem"]');
      let clickedUnfriend = false;
      for (const [index, item] of menuItems.entries()) {
        const text = await item.evaluate(el => el.innerText || el.textContent);
        console.log(`🔍 Item ${index + 1}: "${text.trim()}"`);

        if (text && text.toLowerCase().includes('desamigar')) {
          await item.click();
          console.log(`✅ Achou e clicou no botão "Desamigar" no item ${index + 1}`);
          clickedUnfriend = true;
          break;
        }
      }

      if (!clickedUnfriend) {
        console.log(`⚠️ Não encontrou o botão 'Desfazer amizade' para Elemento ${i + 1}`);
        await page.keyboard.press('Escape');
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      await page.waitForSelector('div[aria-label="Confirmar"], div[aria-label="Confirm"], div[role="dialog"] button', { timeout: 5000 });
      const confirmBtn = await page.$('div[aria-label="Confirmar"], div[aria-label="Confirm"], div[role="dialog"] button');
      if (confirmBtn) {
        await confirmBtn.click();
        console.log(`✅ Amigo ${i + 1} removido com confirmação`);
      } else {
        console.log(`⚠️ Botão de confirmação não encontrado para amigo ${i + 1}`);
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (err) {
      console.log(`❌ Erro no amigo ${i + 1}:`, err.message);
    }
  }

  console.log('🏁 Processo concluído.');
  
})();
