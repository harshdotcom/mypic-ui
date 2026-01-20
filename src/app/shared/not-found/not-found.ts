import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="card">
        <h1 class="big-text">404</h1>
        <h2>Oops! You’re lost 🚀</h2>
        <p>
          The page you are looking for has vanished into the digital universe...  
          maybe it went for a coffee ☕
        </p>

        <div class="emoji">🧭</div>

        <a routerLink="/login" class="btn">Take me to Login</a>
      </div>
    </div>
  `,
  styles: [`
  .not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    /* New "closing / curtain-like" textured background */
    background: 
      radial-gradient(circle at top, rgba(255,255,255,0.15), transparent 60%),
      linear-gradient(135deg, #0f172a, #1e293b, #334155);
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    padding: 40px;
    border-radius: 18px;
    text-align: center;
    box-shadow: 0 15px 35px rgba(0,0,0,0.25);
    max-width: 420px;
    border: 1px solid rgba(255,255,255,0.3);
  }

  .big-text {
    font-size: 96px;
    margin: 0;
    background: linear-gradient(90deg, #ff6b6b, #ff922b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
  }

  h2 {
    margin-top: 10px;
    color: #1e293b;
  }

  p {
    color: #475569;
    margin: 15px 0;
  }

  .emoji {
    font-size: 50px;
    margin: 10px 0;
  }

  .btn {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 22px;
    background: linear-gradient(90deg, #0f172a, #1e293b);
    color: white;
    text-decoration: none;
    border-radius: 10px;
    font-weight: bold;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.25);
  }
`]

})
export class NotFoundComponent {}
