import { reactive } from "vue";
import { FIELD_HEIGHT, FIELD_WIDTH } from "./helpers/constants";
import { Side } from "./types";

export type State = {
    cols: number;
    rows: number;
    side: Side;
    region_width: number;
    region_height: number;
};

export class GlobalState {
    private state: State = reactive({
        cols: 16,
        rows: 12,
        side: "HOME",
        region_width: FIELD_WIDTH / 16,
        region_height: FIELD_HEIGHT / 12,
    });

    // IS
    isHomeSide(): boolean {
        return this.state.side === "HOME";
    }

    isAwaySide(): boolean {
        return this.state.side === "AWAY";
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
}

const global: GlobalState = new GlobalState();

export default global;
