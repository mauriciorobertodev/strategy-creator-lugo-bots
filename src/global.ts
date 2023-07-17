import { reactive, watch } from "vue";
import { AWAY_GOAL_CENTER, HOME_GOAL_CENTER } from "./helpers/constants";
import { FormationType, GlobalStateLocalStorage, HoldedPlayer, PlayerNumber, PlayerPosition, Side } from "./types";
import PlayerContract from "./contracts/player-contract";
import { getGoalkeeper, getPlayers } from "./helpers/players";
import StrategyContract from "./contracts/strategy-contract";
import Strategy from "./classes/strategy";
import Formation from "./classes/formation";

export type State = {
    current_strategy_uuid: string;
    strategies: StrategyContract[];
    side: Side;
    show_col_and_rows: boolean;
    goalkeeper: PlayerContract;
    players: PlayerContract[];
    holded_player?: HoldedPlayer;
    player_under_mouse?: PlayerContract;
    block_goal_area: boolean;
};

export class GlobalState {
    private state: State = reactive({
        side: "HOME",
        show_col_and_rows: false,
        goalkeeper: getGoalkeeper(),
        players: getPlayers(),
        holded_player: undefined,
        player_under_mouse: undefined,
        block_goal_area: false,
        current_strategy_uuid: "free_mode",
        strategies: [new Strategy({ cols: 16, rows: 12, uuid: "free_mode", name: "Modo Livre", current_formation_uuid: "batata", formations: [{ uuid: "batata", name: "batata", type: "FREE" }] })],
    });

    constructor() {
        watch(this.state, () => this.saveInLocalStorage());
    }

    // IS e HAS e SHOW
    isHomeSide(): boolean {
        return this.state.side === "HOME";
    }

    isAwaySide(): boolean {
        return this.state.side === "AWAY";
    }

    isFreeMode(): boolean {
        return this.state.current_strategy_uuid === "free_mode";
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
        return this.getCurrentStrategy().getCurrentFormation().getType() === type;
    }

    // GETTERS
    getCols(): number {
        return this.getCurrentStrategy().getCols();
    }

    getRows(): number {
        return this.getCurrentStrategy().getRows();
    }

    getSide(): Side {
        return this.state.side;
    }

    getRegionWidth(): number {
        return this.getCurrentStrategy().getRegionWidth();
    }

    getRegionHeight(): number {
        return this.getCurrentStrategy().getRegionHeight();
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
        return this.getCurrentStrategy().getCurrentFormation().getType();
    }

    getBlockGoalArea(): boolean {
        return this.state.block_goal_area;
    }

    getCurrentStrategy(): StrategyContract {
        const strategy = this.getStrategy(this.state.current_strategy_uuid);
        if (strategy) return strategy;
        if (this.state.strategies.length == 0) throw new Error("Não existe nenhuma estratégia");
        console.warn("Estratégia requerida não existe alterando estratégia para a primeira da lista");
        this.state.current_strategy_uuid = this.state.strategies[0].getUuid();
        return this.state.strategies[0];
    }

    getStrategy(uuid: string): StrategyContract | undefined {
        return this.state.strategies.find((strategy) => strategy.getUuid() === uuid);
    }

    getPlayer(number: PlayerNumber): PlayerContract | null {
        const player = this.getPlayers().find((player) => player.getNumber() === number);
        if (player) return player;
        return null;
    }

    getStrategies(): StrategyContract[] {
        return this.state.strategies;
    }

    // SETTERS
    setCols(cols: number): void {
        this.getCurrentStrategy().setCols(cols);
        this.updatePlayersPositionByColAndRow();
    }

    setRows(rows: number): void {
        this.getCurrentStrategy().setRows(rows);
        this.updatePlayersPositionByColAndRow();
    }

    setColsAndRows(cols: number, rows: number): void {
        this.getCurrentStrategy().setColsAndRows(cols, rows);
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
        this.getCurrentStrategy().getCurrentFormation().setType(type);
    }

    setBlockGoalArea(block: boolean): void {
        this.state.block_goal_area = block;
    }

    setPlayerPosition(number: PlayerNumber, position: PlayerPosition): void {
        this.getCurrentStrategy().getCurrentFormation().setPlayerPosition(number, position);
    }

    // FUNÇÕES PARA COLUNAS E LINHAS
    incrementCol(): void {
        this.setCols(this.getCols() + 1);
    }

    decrementCol(): void {
        if (this.getCols() <= 0) return;
        this.setCols(this.getCols() - 1);
    }

    incrementRow(): void {
        this.setRows(this.getRows() + 1);
    }

    decrementRow(): void {
        if (this.getRows() <= 0) return;
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

    saveInLocalStorage() {
        const data = JSON.stringify(this.getLocalStorageData());
        localStorage.removeItem("strategy-creator-lugo-bots");
        localStorage.setItem("strategy-creator-lugo-bots", data);
    }

    loadFromLocalStorage() {
        const json = localStorage.getItem("strategy-creator-lugo-bots");
        if (!json) return;
        const data = JSON.parse(json) as GlobalStateLocalStorage;

        this.state.side = data.side;
        this.state.show_col_and_rows = data.show_col_and_rows;
        this.state.block_goal_area = data.block_goal_area;
        this.state.current_strategy_uuid = data.current_strategy_uuid;
        this.state.strategies = data.strategies.map((strateCreatorData) => new Strategy(strateCreatorData));

        global.getPlayers().forEach((player) => {
            const position = global.getCurrentStrategy().getCurrentFormation().getTeamPositions()[player.getNumber()];
            if (position.col && position.row) player.setColAndRow(position.col, position.row);
            else player.resetPosition();
        });
        global.getGoalkeeper().setPosition(global.isHomeSide() ? HOME_GOAL_CENTER : AWAY_GOAL_CENTER);
    }

    getLocalStorageData(): GlobalStateLocalStorage {
        return {
            current_strategy_uuid: this.state.current_strategy_uuid,
            strategies: this.state.strategies.map((strategy) => strategy.getCreatorData()),
            side: this.getSide(),
            show_col_and_rows: this.showColsAndRows(),
            block_goal_area: this.getBlockGoalArea(),
        };
    }

    setNewStrategy(cols: number, rows: number, name: string, formation_name: string, formation_type: FormationType): void {
        const formation = new Formation({ name: formation_name, type: formation_type });
        const strategy = new Strategy({ name, cols, rows });

        strategy.addFormation(formation);
        strategy.setCurrentFormation(formation.getUuid());

        this.state.strategies.push(strategy);
        this.state.current_strategy_uuid = strategy.getUuid();
        this.getPlayers().map((p) => p.resetPosition());
    }

    setCurrentStrategy(uuid: string): void {
        const strategy = this.getStrategies().find((strategy) => strategy.getUuid() === uuid);
        if (!strategy) throw new Error("Essa estratégia não existe");
        this.state.current_strategy_uuid = uuid;

        global.getPlayers().forEach((player) => {
            const position = global.getCurrentStrategy().getCurrentFormation().getTeamPositions()[player.getNumber()];
            if (position.col && position.row) player.setColAndRow(position.col, position.row);
            else player.resetPosition();
        });
        global.getGoalkeeper().setPosition(global.isHomeSide() ? HOME_GOAL_CENTER : AWAY_GOAL_CENTER);
    }

    deleteCurrentStrategy() {
        const uuid = global.getCurrentStrategy().getUuid();
        const strategy = this.getStrategies().find((strategy) => strategy.getUuid() === uuid);
        if (!strategy) throw new Error("Essa estratégia não existe");
        global.setCurrentStrategy("free_mode");
        this.state.strategies = this.state.strategies.filter((strategy) => strategy.getUuid() != uuid);
    }
}

const global: GlobalState = new GlobalState();

export default global;

global.loadFromLocalStorage();
