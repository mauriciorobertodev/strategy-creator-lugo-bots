import { reactive, watch } from "vue";
import { AWAY_GOAL_CENTER, FREE_MODE_UUID, HOME_GOAL_CENTER } from "./helpers/constants";
import { FormationType, GlobalStateLocalStorage, HoldedPlayer, PlayerNumber, PlayerPosition, Side } from "./types";
import PlayerContract from "./contracts/player-contract";
import { getGoalkeeper, getPlayers } from "./helpers/players";
import StrategyContract from "./contracts/strategy-contract";
import Strategy from "./classes/strategy";
import Formation from "./classes/formation";
import FieldZoneContract from "./contracts/field-zone-contract";
import FieldZone from "./classes/field-zone";
import { isPermittedFieldZone } from "./helpers/field";

export type State = {
    current_strategy_uuid: string;
    strategies: StrategyContract[];
    side: Side;
    show_col_and_rows: boolean;
    goalkeeper: PlayerContract;
    players: PlayerContract[];
    holded_player?: HoldedPlayer;
    player_under_mouse?: PlayerContract;

    temporary_field_zone?: FieldZoneContract;
    show_zone_fields: boolean;
};

export class GlobalState {
    private state: State = reactive({
        side: "HOME",
        show_col_and_rows: false,
        goalkeeper: getGoalkeeper(),
        players: getPlayers(),
        holded_player: undefined,
        player_under_mouse: undefined,
        current_strategy_uuid: FREE_MODE_UUID,
        strategies: [new Strategy({ cols: 16, rows: 12, uuid: FREE_MODE_UUID, name: "Modo Livre", current_formation_uuid: "batata", formations: [{ uuid: "batata", name: "batata", type: "FREE" }] })],
        temporary_field_zone: undefined,
        show_zone_fields: false,
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
        return this.state.current_strategy_uuid === FREE_MODE_UUID;
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

    showFieldZones(): boolean {
        return this.state.show_zone_fields;
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

    setShowFieldZones(show: boolean): void {
        this.state.show_zone_fields = show;
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

    setPlayerColAndRow(number: PlayerNumber, colAndRow: PlayerPosition): void {
        const player = this.getPlayer(number);

        if (number == 1 || !player) return;

        if (colAndRow.col === null || colAndRow.col < 0 || colAndRow.row == null || colAndRow.row < 0) {
            this.getCurrentStrategy().getCurrentFormation().setPlayerPosition(number, { col: null, row: null });
            player.resetPosition();
        } else {
            player.setColAndRow(colAndRow.col, colAndRow.row);
            this.getCurrentStrategy().getCurrentFormation().setPlayerPosition(number, colAndRow);
        }
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
        this.state.current_strategy_uuid = data.current_strategy_uuid;
        this.state.show_zone_fields = data.show_zone_fields;
        this.state.strategies = data.strategies.map((strateCreatorData) => new Strategy(strateCreatorData));

        global.getPlayers().forEach((player) => {
            const position = global.getCurrentStrategy().getCurrentFormation().getTeamPositions()[player.getNumber()];
            if (position.col != null && position.row != null) player.setColAndRow(position.col, position.row);
            else player.resetPosition();
        });
        global.getGoalkeeper().setPosition(global.isHomeSide() ? HOME_GOAL_CENTER : AWAY_GOAL_CENTER);
    }

    getLocalStorageData(): GlobalStateLocalStorage {
        return {
            current_strategy_uuid: this.state.current_strategy_uuid,
            strategies: this.state.strategies.map((strategy) => strategy.getCreatorData(true)),
            side: this.getSide(),
            show_col_and_rows: this.showColsAndRows(),
            show_zone_fields: this.showFieldZones(),
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

    newFormation(name: string, type: FormationType): void {
        const formation = new Formation({ name, type });
        this.getCurrentStrategy().addFormation(formation);
        this.getCurrentStrategy().setCurrentFormation(formation.getUuid());
        this.updatePlayerPositionByCurrentFormation();
    }

    setCurrentStrategy(uuid: string): void {
        const strategy = this.getStrategies().find((strategy) => strategy.getUuid() === uuid);
        if (!strategy) throw new Error("Essa estratégia não existe");
        this.state.current_strategy_uuid = uuid;
        this.updatePlayerPositionByCurrentFormation();
    }

    setCurrentFormation(uuid: string): void {
        this.getCurrentStrategy().setCurrentFormation(uuid);
        this.updatePlayerPositionByCurrentFormation();
    }

    deleteCurrentStrategy() {
        const uuid = global.getCurrentStrategy().getUuid();
        const strategy = this.getStrategies().find((strategy) => strategy.getUuid() === uuid);
        if (!strategy) throw new Error("Essa estratégia não existe");
        global.setCurrentStrategy(FREE_MODE_UUID);
        this.state.strategies = this.state.strategies.filter((strategy) => strategy.getUuid() != uuid);
        this.updatePlayerPositionByCurrentFormation();
    }

    deleteCurrentFormation() {
        const uuid = global.getCurrentStrategy().getCurrentFormation().getUuid();
        this.deleteFormation(uuid);
    }

    deleteFormation(uuid: string) {
        const formation = this.getCurrentStrategy()
            .getFormations()
            .find((formation) => formation.getUuid() === uuid);
        if (!formation) throw new Error("Essa formação não existe");
        this.getCurrentStrategy().deleteFormation(uuid);
        this.updatePlayerPositionByCurrentFormation();
    }

    updatePlayerPositionByCurrentFormation(): void {
        global.getPlayers().forEach((player) => {
            const position = global.getCurrentStrategy().getCurrentFormation().getTeamPositions()[player.getNumber()];
            if (position.col != null && position.row != null) player.setColAndRow(position.col, position.row);
            else player.resetPosition();
        });
        global.getGoalkeeper().setPosition(global.isHomeSide() ? HOME_GOAL_CENTER : AWAY_GOAL_CENTER);
    }
    getTemporaryZone(): FieldZoneContract {
        if (!this.state.temporary_field_zone)
            this.state.temporary_field_zone = new FieldZone({
                color: { r: 255, g: 255, b: 255 },
                start_col: -1,
                end_col: -1,
                start_row: -1,
                end_row: -1,
            });

        return this.state.temporary_field_zone;
    }

    saveTemporaryFieldZone() {
        if (isPermittedFieldZone(this.getTemporaryZone().getDefinition())) {
            this.getCurrentStrategy().getCurrentFormation().setFieldZone(this.getTemporaryZone());
            this.getCurrentStrategy().getCurrentFormation().setSelectingTheZone(false);
            this.state.temporary_field_zone = undefined;
        }
    }

    editFieldZone(): void {
        if (!this.getCurrentStrategy().getCurrentFormation().hasFieldZone()) return;
        this.state.temporary_field_zone = new FieldZone(this.getCurrentStrategy().getCurrentFormation().getFieldZone().getCreatorData(false));
        this.getCurrentStrategy().getCurrentFormation().setSelectingTheZone(true);
    }

    deleteCurrentFieldZone() {
        this.getCurrentStrategy().getCurrentFormation().deleteFieldZone();
    }

    addStrategy(strategy: StrategyContract) {
        this.state.strategies.push(strategy);
    }

    cancelEditOrNewFieldZone() {
        this.getCurrentStrategy().getCurrentFormation().setSelectingTheZone(false);
        this.state.temporary_field_zone = undefined;
    }
}

const global: GlobalState = new GlobalState();

export default global;

global.loadFromLocalStorage();
