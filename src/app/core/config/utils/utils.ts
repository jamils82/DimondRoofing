export class CommonUtils {
  public static isMobile(): boolean {
    if (window.innerWidth < 768) {
      return true;
    }
    else {
      return false;
    }
  }
  public static isTablet(): boolean {
    if (window.innerWidth>= 991) {
      return true;
    }
    else {
      return false;
    }
  }
  public static isDesktop(): boolean {
    if (window.innerWidth>991) {
      return true;
    }
    else {
      return false;
    }
  }
}