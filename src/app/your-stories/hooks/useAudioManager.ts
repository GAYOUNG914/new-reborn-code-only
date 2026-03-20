// 전역 오디오 관리 시스템
class AudioManager {
  private static instance: AudioManager;
  private currentlyPlayingId: number | null = null;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setCurrentlyPlaying(id: number | null): void {
    this.currentlyPlayingId = id;
  }

  getCurrentlyPlaying(): number | null {
    return this.currentlyPlayingId;
  }

  pauseAllExcept(id: number): void {
    const currentId = this.currentlyPlayingId;
    if (currentId !== null && currentId !== id) {
      // 다른 오디오가 재생 중이면 일시정지 이벤트 발생
      window.dispatchEvent(new CustomEvent('pauseAudio', { detail: { exceptId: id } }));
    }
    this.currentlyPlayingId = id;
  }

  pauseAll(): void {
    window.dispatchEvent(new CustomEvent('pauseAudio', { detail: { exceptId: null } }));
    this.currentlyPlayingId = null;
  }
}

export const audioManager = AudioManager.getInstance();