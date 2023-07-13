import { reactive } from "vue";
import { FIELD_HEIGHT, FIELD_WIDTH } from "./helpers/constants";
import { Side } from "./types";
import PlayerContract from "./contracts/player-contract";
import { getGoalkeeper, getPlayers } from "./helpers/players";

export type State = {
    cols: number;
    rows: number;
    side: Side;
    region_width: number;
    region_height: number;
    goalkeeper: PlayerContract;
    players: PlayerContract[];
    holded_player: PlayerContract | undefined;
};

export class GlobalState {
    private state: State = reactive({
        cols: 16,
        rows: 12,
        side: "HOME",
        region_width: FIELD_WIDTH / 16,
        region_height: FIELD_HEIGHT / 12,
        goalkeeper: getGoalkeeper(),
        players: getPlayers(),
        holded_player: undefined,
    });

    // IS e HAS
    isHomeSide(): boolean {
        return this.state.side === "HOME";
    }

    isAwaySide(): boolean {
        return this.state.side === "AWAY";
    }

    hasHoldedPlayer(): boolean {
        return this.state.holded_player ? true : false;
    }

    // GETTERS
    getCols(): number {
        return this.state.cols;
    }

    getRows(): number {
        return this.state.rows;
    }

    getSide(): Side {
        return this.state.side;
    }

    getRegionWidth(): number {
        return this.state.region_width;
    }

    getRegionHeight(): number {
        return this.state.region_height;
    }

    getPlayers(): PlayerContract[] {
        return this.state.players;
    }

    getGoalkeeper(): PlayerContract {
        return this.state.goalkeeper;
    }

    getHoldedPlayer(): PlayerContract {
        if (!this.state.holded_player) throw new Error("Não nenhum jogador sendo segurado");
        return this.state.holded_player;
    }

    // SETTERS
    setCols(cols: number): void {
        this.state.cols = cols;
        this.state.region_width = FIELD_WIDTH / cols;
    }

    setRows(rows: number): void {
        this.state.rows = rows;
        this.state.region_height = FIELD_HEIGHT / rows;
    }

    setSide(side: Side): void {
        this.state.side = side;
    }

    setHoldedPlayer(player: PlayerContract): void {
        this.state.holded_player = player;
    }

    // FUNÇÕES PARA COLUNAS E LINHAS
    incrementCol(): void {
        this.setCols(this.getCols() + 1);
    }

    decrementCol(): void {
        if (this.state.cols <= 0) return;
        this.setCols(this.getCols() - 1);
    }

    incrementRow(): void {
        this.setRows(this.getRows() + 1);
    }

    decrementRow(): void {
        if (this.state.rows <= 0) return;
        this.setRows(this.getRows() - 1);
    }

    resetHoldedPlayer(): void {
        this.state.holded_player = undefined;
    }
}

const global: GlobalState = new GlobalState();

export default global;
