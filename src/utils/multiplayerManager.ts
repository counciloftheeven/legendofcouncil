import { Karakter } from '../rules';

export interface RoomPlayer {
  id: string;
  name: string;
  role: 'Anlatıcı' | 'Oyuncu';
  characterId?: string;
  characterName?: string;
  characterHouse?: string;
  lastSeen: number;
}

export interface MultiplayerEvent {
  id: string;
  sender: string;
  type: 'zar' | 'muhur' | 'sahne' | 'anlati' | 'fisilti' | 'durum' | 'hasar' | 'chat';
  payload: any;
  timestamp: string;
  target?: string;
}

export interface RoomSnapshot {
  id: string;
  title: string;
  activeScene?: string;
  activeAspects: string[];
  players: RoomPlayer[];
  events: MultiplayerEvent[];
  totalEvents: number;
}

type EventListener = (event: MultiplayerEvent) => void;
type PlayersListener = (players: RoomPlayer[]) => void;

class MultiplayerManager {
  private roomId: string | null = null;
  private playerId: string | null = null;
  private playerName: string = 'Seyyah';
  private playerRole: 'Anlatıcı' | 'Oyuncu' = 'Oyuncu';
  private character: Karakter | null = null;
  private lastEventCount: number = 0;
  private pollInterval: any = null;
  private heartbeatInterval: any = null;

  private eventListeners: Set<EventListener> = new Set();
  private playersListeners: Set<PlayersListener> = new Set();
  private cachedPlayers: RoomPlayer[] = [];
  private cachedAspects: string[] = [];

  constructor() {
    this.roomId = localStorage.getItem('council_mp_room_id') || null;
    this.playerId = localStorage.getItem('council_mp_player_id') || null;
    this.playerName = localStorage.getItem('council_mp_player_name') || 'Seyyah';
    this.playerRole = (localStorage.getItem('council_mp_role') as any) || 'Oyuncu';
  }

  public getRoomId(): string | null {
    return this.roomId;
  }

  public getPlayerId(): string | null {
    return this.playerId;
  }

  public getPlayerName(): string {
    return this.playerName;
  }

  public getPlayerRole(): 'Anlatıcı' | 'Oyuncu' {
    return this.playerRole;
  }

  public isConnected(): boolean {
    return !!this.roomId && !!this.playerId;
  }

  public getPlayers(): RoomPlayer[] {
    return this.cachedPlayers;
  }

  public getAspects(): string[] {
    return this.cachedAspects;
  }

  public onEvent(callback: EventListener) {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  public onPlayersChange(callback: PlayersListener) {
    this.playersListeners.add(callback);
    return () => this.playersListeners.delete(callback);
  }

  public setCharacter(character: Karakter | null) {
    this.character = character;
  }

  public async createRoom(
    title: string,
    hostName: string,
    character?: Karakter
  ): Promise<{ success: boolean; roomId?: string; error?: string }> {
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          hostName,
          characterId: character?.id,
          characterName: character?.ad,
          characterHouse: character?.hane,
        }),
      });

      const data = await res.json();
      if (data.success) {
        this.roomId = data.roomId;
        this.playerId = data.hostId;
        this.playerName = hostName;
        this.playerRole = 'Anlatıcı';
        this.character = character || null;

        if (this.roomId && this.playerId) {
          localStorage.setItem('council_mp_room_id', this.roomId);
          localStorage.setItem('council_mp_player_id', this.playerId);
        }
        localStorage.setItem('council_mp_player_name', this.playerName);
        localStorage.setItem('council_mp_role', this.playerRole);

        this.startSync();
        return { success: true, roomId: this.roomId || undefined };
      }
      return { success: false, error: data.error || 'Oda açılamadı.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Ağ hatası.' };
    }
  }

  public async joinRoom(
    roomId: string,
    playerName: string,
    role: 'Anlatıcı' | 'Oyuncu',
    character?: Karakter
  ): Promise<{ success: boolean; roomId?: string; error?: string }> {
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          playerName,
          role,
          characterId: character?.id,
          characterName: character?.ad,
          characterHouse: character?.hane,
        }),
      });

      const data = await res.json();
      if (data.success) {
        this.roomId = data.roomId;
        this.playerId = data.playerId;
        this.playerName = playerName;
        this.playerRole = role;
        this.character = character || null;

        if (this.roomId && this.playerId) {
          localStorage.setItem('council_mp_room_id', this.roomId);
          localStorage.setItem('council_mp_player_id', this.playerId);
        }
        localStorage.setItem('council_mp_player_name', this.playerName);
        localStorage.setItem('council_mp_role', this.playerRole);

        this.startSync();
        return { success: true, roomId: this.roomId || undefined };
      }
      return { success: false, error: data.error || 'Odaya bağlanılamadı.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Ağ hatası.' };
    }
  }

  public leaveRoom() {
    this.stopSync();
    this.roomId = null;
    this.playerId = null;
    localStorage.removeItem('council_mp_room_id');
    localStorage.removeItem('council_mp_player_id');
    this.cachedPlayers = [];
    this.notifyPlayersListeners([]);
  }

  public async broadcast(
    type: 'zar' | 'muhur' | 'sahne' | 'anlati' | 'fisilti' | 'durum' | 'hasar' | 'chat',
    payload: any,
    target?: string
  ) {
    if (!this.roomId) return;
    try {
      await fetch(`/api/rooms/${this.roomId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: this.character ? `${this.character.ad} (${this.playerName})` : this.playerName,
          type,
          payload,
          target,
        }),
      });
    } catch (e) {
      console.warn('Yayın hatası:', e);
    }
  }

  public async updateAspects(aspects: string[]) {
    if (!this.roomId) return;
    try {
      await fetch(`/api/rooms/${this.roomId}/aspects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aspects }),
      });
      this.cachedAspects = aspects;
    } catch (e) {
      console.warn('Aspect güncelleme hatası:', e);
    }
  }

  public startSync() {
    this.stopSync();
    if (!this.roomId) return;

    // Initial fetch
    this.poll();

    // Polling every 2.5s for snappy real-time dice & events
    this.pollInterval = setInterval(() => this.poll(), 2500);

    // Heartbeat every 20s
    this.heartbeatInterval = setInterval(() => this.heartbeat(), 20000);
  }

  public stopSync() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.pollInterval = null;
    this.heartbeatInterval = null;
  }

  private async poll() {
    if (!this.roomId) return;
    try {
      const res = await fetch(`/api/rooms/${this.roomId}?since=${this.lastEventCount}`);
      if (!res.ok) {
        if (res.status === 404) {
          // Room deleted or expired
          this.leaveRoom();
        }
        return;
      }

      const snapshot: RoomSnapshot = await res.json();
      this.cachedPlayers = snapshot.players || [];
      this.cachedAspects = snapshot.activeAspects || [];
      this.notifyPlayersListeners(this.cachedPlayers);

      // Notify incoming events
      if (snapshot.events && snapshot.events.length > 0) {
        this.lastEventCount += snapshot.events.length;
        for (const ev of snapshot.events) {
          // If event is target-specific and not for me, ignore
          if (ev.target && ev.target !== this.playerId && ev.target !== this.playerName) {
            continue;
          }
          this.notifyEventListeners(ev);
        }
      }
    } catch {
      // Network hiccup; will retry next interval
    }
  }

  private async heartbeat() {
    if (!this.roomId || !this.playerId) return;
    try {
      await fetch(`/api/rooms/${this.roomId}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: this.playerId,
          characterId: this.character?.id,
          characterName: this.character?.ad,
        }),
      });
    } catch {}
  }

  private notifyEventListeners(ev: MultiplayerEvent) {
    for (const listener of this.eventListeners) {
      listener(ev);
    }
  }

  private notifyPlayersListeners(players: RoomPlayer[]) {
    for (const listener of this.playersListeners) {
      listener(players);
    }
  }
}

export const multiplayer = new MultiplayerManager();
