import { reactive } from "vue";
import { AWAY_GOAL_CENTER, FIELD_HEIGHT, FIELD_WIDTH, HOME_GOAL_CENTER } from "./helpers/constants";
import { FormationType, HoldedPlayer, Side } from "./types";
import PlayerContract from "./contracts/player-contract";
import { getGoalkeeper, getPlayers } from "./helpers/players";

export type State = {
    cols: number;
    rows: number;
    side: Side;
    region_width: number;
    region_height: number;
    show_col_and_rows: boolean;
    goalkeeper: PlayerContract;
    players: PlayerContract[];
    holded_player: HoldedPlayer | undefined;
    player_under_mouse: PlayerContract | undefined;
    current_formation_type: FormationType;
};

export class GlobalState {
    private state: State = reactive({
        cols: 16,
        rows: 12,
        side: "HOME",
        region_width: FIELD_WIDTH / 16,
        region_height: FIELD_HEIGHT / 12,
        show_col_and_rows: false,
        goalkeeper: getGoalkeeper(),
        players: getPlayers(),
        holded_player: undefined,
        player_under_mouse: undefined,
        current_formation_type: "FREE",
    });

    // IS e HAS e SHOW
    isHomeSide(): boolean {
        return this.state.side === "HOME";
    }

    isAwaySide(): boolean {
        return this.state.side === "AWAY";
    }

    hasHoldedPlayer(): boolean {
        return this.state.holded_player ? true : false;
    }

    hasPlayerUnderMouse(): boolean {
        return this.state.player_under_mouse ? true : false;
    }

    showColsAndRows(): boolean {
        return this.state.show_col_and_rows;
    }

    currentFormationTypeIs(type: FormationType): boolean {
        return this.state.current_formation_type === type;
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

    getHoldedPlayer(): HoldedPlayer {
        if (!this.state.holded_player) throw new Error("Não nenhum jogador sendo segurado");
        return this.state.holded_player;
    }

    getPlayerUnderMouse(): PlayerContract {
        if (!this.state.player_under_mouse) throw new Error("O mouse não está acima de nenhum jogador");
        return this.state.player_under_mouse;
    }

    getCurrentFormationType(): FormationType {
        return this.state.current_formation_type;
    }

    // SETTERS
    setCols(cols: number): void {
        this.state.cols = cols;
        this.state.region_width = FIELD_WIDTH / cols;
        this.updatePlayersPositionByColAndRow();
    }

    setRows(rows: number): void {
        this.state.rows = rows;
        this.state.region_height = FIELD_HEIGHT / rows;
        this.updatePlayersPositionByColAndRow();
    }

    setSide(side: Side): void {
        this.state.side = side;
        this.updatePlayersPositionByColAndRow();
    }

    setHoldedPlayer(holderPlayer: HoldedPlayer): void {
        this.state.holded_player = holderPlayer;
    }

    setPlayerUnderMouse(player: PlayerContract): void {
        this.state.player_under_mouse = player;
    }

    setShowColsAndRows(show: boolean) {
        this.state.show_col_and_rows = show;
    }

    setCurrentFormationType(type: FormationType): void {
        this.state.current_formation_type = type;
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

    resetPlayerUnderMouse(): void {
        this.state.player_under_mouse = undefined;
    }

    updatePlayersPositionByColAndRow(): void {
        this.getPlayers().forEach((player) => player.updatePositionByColAndRow());
        this.getGoalkeeper().setPosition(this.isHomeSide() ? HOME_GOAL_CENTER : AWAY_GOAL_CENTER);
    }
}

const global: GlobalState = new GlobalState();

export default global;
