import FieldZoneContract from "../contracts/field-zone-contract";
import FormationContract from "../contracts/formation-contract";
import { getDefaultInitialPositions } from "../helpers/players";
import { FormationType, TeamPositions } from "../types";

export default class Formation implements FormationContract {
    private type: FormationType = "FREE";
    private selecting_zone = false;
    private field_zone: FieldZoneContract | undefined = undefined;
    private team_positions: TeamPositions = getDefaultInitialPositions();

    constructor(
        private name: string,
        type?: FormationType,
    ) {
        this.type = type ?? "FREE";
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
}
