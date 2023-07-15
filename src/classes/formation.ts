import FieldZoneContract from "../contracts/field-zone-contract";
import FormationContract from "../contracts/formation-contract";
import { getDefaultInitialPositions } from "../helpers/players";
import { FormationCreator, FormationType, PlayerNumber, PlayerPosition, TeamPositions } from "../types";
import FieldZone from "./field-zone";

export default class Formation implements FormationContract {
    private selecting_zone = false;
    private name: string;
    private type: FormationType;
    private field_zone?: FieldZoneContract;
    private team_positions: TeamPositions;

    constructor({ name, type, team_positions, field_zone }: FormationCreator) {
        this.type = type ?? "FREE";
        this.name = name;
        this.team_positions = team_positions ?? getDefaultInitialPositions();
        this.field_zone = typeof field_zone == "object" ? new FieldZone(field_zone) : undefined;
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

    getTeamPositions(): TeamPositions {
        return this.team_positions;
    }

    setPlayerPosition(number: PlayerNumber, position: PlayerPosition): void {
        this.team_positions[number] = position;
    }

    public toJson(): string {
        return JSON.stringify(this.getCreatorData());
    }

    public getCreatorData(): FormationCreator {
        return {
            name: this.getName(),
            type: this.getType(),
            field_zone: this.hasFieldZone() ? this.getFieldZone().getCreatorData() : undefined,
            team_positions: this.getTeamPositions(),
        };
    }
}