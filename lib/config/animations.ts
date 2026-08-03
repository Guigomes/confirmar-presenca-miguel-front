// Tempos (em ms) das animações-surpresa da página principal.
// Os valores de duração precisam bater com os keyframes em `app/globals.css`.
export const animations = {
  /** O dino montado pelo cavalo entra 3s depois da página carregar */
  dinoDelay: 3_000,
  /** Travessia do dino — igual à duração da animação `dino-cross` */
  dinoDuration: 9_000,
  /** Respiro entre uma cena e outra */
  gap: 1_000,
  /** Peixe x elefante — igual à duração da animação `match-scene` */
  matchDuration: 12_000,
};

/** A pelada começa logo depois que o dino termina de atravessar a tela */
export const matchDelay = animations.dinoDelay + animations.dinoDuration + animations.gap;
