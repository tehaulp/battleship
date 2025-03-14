export class StageManager {
  private static navyElement: HTMLDivElement | null = null;
  private static pirateElement: HTMLDivElement | null = null;

  static init(
    navyElementRef: React.RefObject<HTMLDivElement | null>,
    pirateElementRef: React.RefObject<HTMLDivElement | null>
  ) {
    this.navyElement = navyElementRef.current;
    this.pirateElement = pirateElementRef.current;
  }

  private static triggerAnimation(
    element: HTMLDivElement | null,
    text: string
  ) {
    if (!element) return;

    const textElement = element.querySelector("p");
    if (textElement) textElement.textContent = text;

    element.classList.add("animate-pop");

    setTimeout(() => {
      element?.classList.remove("animate-pop");
      if (textElement) textElement.textContent = ""; // Efface le texte après disparition
    }, 3100); // Durée de l'animation
  }

  static showPirate(text: string) {
    this.triggerAnimation(this.pirateElement, text);
  }

  static showNavy(text: string) {
    this.triggerAnimation(this.navyElement, text);
  }
}
