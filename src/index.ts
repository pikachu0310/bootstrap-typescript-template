// Bootstrap のJavaScript機能をインポート
import 'bootstrap';

// スタイルファイルをインポート
import './styles.scss';

// 型定義
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface AppState {
  isLoading: boolean;
  progressValue: number;
}

class App {
  private state: AppState = {
    isLoading: false,
    progressValue: 75
  };

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.setupSmoothScrolling();
    this.animateProgressBar();
    console.log('Bootstrap TypeScript Template が初期化されました');
  }

  private setupEventListeners(): void {
    // プライマリボタン
    const primaryBtn = document.getElementById('primary-btn') as HTMLButtonElement;
    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => {
        this.showToast('プライマリアクションが実行されました！', 'success');
      });
    }

    // セカンダリボタン
    const secondaryBtn = document.getElementById('secondary-btn') as HTMLButtonElement;
    if (secondaryBtn) {
      secondaryBtn.addEventListener('click', () => {
        this.showToast('詳細情報を表示中...', 'info');
      });
    }

    // デモボタン
    const demoBtn = document.getElementById('demo-btn') as HTMLButtonElement;
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        this.handleDemoButtonClick(demoBtn);
      });
    }

    // コンタクトフォーム
    const contactForm = document.getElementById('contact-form') as HTMLFormElement;
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(contactForm);
      });
    }

    // ナビゲーションリンク
    this.setupNavigationLinks();
  }

  private setupNavigationLinks(): void {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // アクティブクラスを更新
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // スムーススクロール
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  private setupSmoothScrolling(): void {
    // スクロール位置に基づいてナビゲーションのアクティブ状態を更新
    window.addEventListener('scroll', () => {
      const sections = ['home', 'about', 'contact'];
      const scrollPos = window.scrollY + 100;

      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (section && navLink) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
              link.classList.remove('active');
            });
            navLink.classList.add('active');
          }
        }
      });
    });
  }

  private handleDemoButtonClick(button: HTMLButtonElement): void {
    const spinner = button.querySelector('.spinner-border');
    const originalText = button.textContent;
    
    if (this.state.isLoading) return;
    
    this.state.isLoading = true;
    
    // ローディング状態を表示
    if (spinner) {
      spinner.classList.remove('d-none');
    }
    button.disabled = true;
    button.textContent = '処理中...';
    
    // 2秒後にローディングを終了
    setTimeout(() => {
      this.state.isLoading = false;
      
      if (spinner) {
        spinner.classList.add('d-none');
      }
      button.disabled = false;
      button.textContent = originalText;
      
      this.showToast('デモアクションが完了しました！', 'success');
      this.updateProgressBar(100);
    }, 2000);
  }

  private handleFormSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string
    };

    // バリデーション
    if (!this.validateFormData(data)) {
      this.showToast('入力内容に不備があります', 'error');
      return;
    }

    // フォーム送信のシミュレーション
    console.log('フォームデータ:', data);
    this.showToast(`${data.name}さん、お問い合わせありがとうございます！`, 'success');
    
    // フォームをリセット
    form.reset();
  }

  private validateFormData(data: ContactFormData): boolean {
    return !!(data.name && data.email && data.message && 
             data.email.includes('@') && data.name.length >= 2);
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const toastElement = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toastElement || !toastMessage) return;

    // メッセージを設定
    toastMessage.textContent = message;
    
    // タイプに応じてスタイルを変更
    toastElement.className = 'toast';
    switch (type) {
      case 'success':
        toastElement.classList.add('bg-success', 'text-white');
        break;
      case 'error':
        toastElement.classList.add('bg-danger', 'text-white');
        break;
      default:
        toastElement.classList.add('bg-primary', 'text-white');
    }

    // Bootstrap Toast を表示
    const bsToast = new (window as any).bootstrap.Toast(toastElement);
    bsToast.show();
  }

  private animateProgressBar(): void {
    const progressBar = document.querySelector('.progress-bar') as HTMLElement;
    if (!progressBar) return;

    // 初期値を0に設定してからアニメーション
    progressBar.style.width = '0%';
    
    setTimeout(() => {
      progressBar.style.width = `${this.state.progressValue}%`;
    }, 500);
  }

  private updateProgressBar(value: number): void {
    const progressBar = document.querySelector('.progress-bar') as HTMLElement;
    if (!progressBar) return;

    this.state.progressValue = Math.min(100, Math.max(0, value));
    progressBar.style.width = `${this.state.progressValue}%`;
    progressBar.textContent = `${this.state.progressValue}%`;
  }

  // パブリックメソッド（デバッグ用）
  public getState(): AppState {
    return { ...this.state };
  }

  public updateProgress(value: number): void {
    this.updateProgressBar(value);
  }
}

// DOMContentLoaded後にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  
  // グローバルにアクセス可能にする（デバッグ用）
  (window as any).app = app;
});

// TypeScript の型チェック用のエクスポート
export default App;