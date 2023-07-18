import { v4 } from "uuid";
import FieldZoneContract from "../contracts/field-zone-contract";
import FormationContract from "../contracts/formation-contract";
import { getDefaultInitialPositions } from "../helpers/players";
import { FormationCreator, FormationType, PlayerNumber, PlayerPosition, TeamPositions } from "../types";
import FieldZone from "./field-zone";

export default class Formation implements FormationContract {
    private uuid: string;
    private selecting_zone = false;
    private name: string;
    private type: FormationType;
    private field_zone?: FieldZoneContract;
    private team_positions: TeamPositions;
    block_goal_area: boolean;

    constructor({ uuid, name, type, team_positions, field_zone, block_goal_area }: FormationCreator) {
        this.type = type ?? "FREE";
        this.name = name;
        this.team_positions = team_positions ?? getDefaultInitialPositions();
        this.field_zone = typeof field_zone == "object" ? new FieldZone(field_zone) : undefined;
        this.uuid = uuid ?? v4();
        this.block_goal_area = block_goal_area ?? false;
    }

    getType(): FormationType {
        return this.type;
    }

    setType(type: FormationType): void {
        this.type = type;
    }

    isInitialPositioning(): boolean {
        return this.type == "INITIAL_POSITIONS";
    }

    isSelectingTheZone(): boolean {
        return this.selecting_zone;
    }

    hasFieldZone(): boolean {
        return this.field_zone ? true : false;
    }

    getFieldZone(): FieldZoneContract {
        if (!this.field_zone) throw new Error("Não há nenhuma zona de campo");
        return this.field_zone;
    }

    setFieldZone(fieldZone: FieldZoneContract): void {
        this.field_zone = fieldZone;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getBlockGoalArea(): boolean {
        return this.block_goal_area;
    }

    setBlockGoalArea(block: boolean): void {
        this.block_goal_area = block;
    }

    getTeamPositions(): TeamPositions {
        return this.team_positions;
    }

    getUuid(): string {
        return this.uuid;
    }

    setPlayerPosition(number: PlayerNumber, position: PlayerPosition): void {
        this.team_positions[number] = position;
    }

    public toJson(): string {
        return JSON.stringify(this.getCreatorData(true));
    }

    public getCreatorData(uuid: boolean): FormationCreator {
        return {
            uuid: uuid ? this.getUuid() : undefined,
            name: this.getName(),
            type: this.getType(),
            field_zone: this.hasFieldZone() ? this.getFieldZone().getCreatorData(uuid) : undefined,
            team_positions: this.getTeamPositions(),
            block_goal_area: this.getBlockGoalArea(),
        };
    }

    setSelectingTheZone(selecting: boolean): void {
        this.selecting_zone = selecting;
    }

    deleteFieldZone(): void {
        if (this.field_zone) this.field_zone = undefined;
    }
}
