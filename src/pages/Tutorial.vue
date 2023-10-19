<script setup lang="ts">
import hljs from "highlight.js/lib/common";
import { onMounted } from "vue";
import CodeBlock from "../components/CodeBlock.vue";

import "highlight.js/styles/base16/material-palenight.css";

onMounted(() => {
    hljs.highlightAll();
});
</script>

<template>
    <article class="px-4 pt-20 mx-auto prose lg:pt-32 max-w-7xl xl:px-0">
        <div class="fixed top-0 left-0 hidden w-2 h-screen bg-blue-500 xl:block"></div>
        <a href="/" class="block pb-4">Criador de estratégia</a>
        <h1 class="text-4xl font-bold text-gray-700 lg:text-5xl">Tutorial / Exemplo de uso</h1>

        <p>Aqui vou explicar passo a passo como eu estou usando as informações que o projeto me da para usar no meu bot. Eu uso a linguagem typescript, mas acredito que você é capaz de entender a dinâmica e implementar na sua linguagem de preferência.</p>
        <p>Você pode desenvolver uma forma usando arquivos json se quiser neste exemplo eu não vou usar arquivos json apenas os dados contidos neles.</p>

        <h2>1. Definindo as colunas e linhas</h2>
        <p>Vá até o arquivo <code>settings.ts</code>do seu bot e altere as colunas e linhas para a quantidade que você escolheu em sua estratégia. Nesse exemplo estou usando 16x12 como mostra abaixo.</p>
        <CodeBlock
            language="typescript"
            code="

    // settings.ts

    export const MAPPER_COLS = 16;
    export const MAPPER_ROWS = 12;

"
        />
        <h2>2. Definindo os tipos</h2>
        <p>Como disse anteriormente vou usar typescript eu gosto de tipagem, então vou começar definindo tipos que eu vou utilizar.</p>
        <p>
            Você pode usar a opção <code class="uppercase">Exportar nomes</code> na sua estratégia para pegar todos os nomes das formações. Abuse do <code>CTRL + D</code> para formatar os nomes no tipo como abaixo.
            <span class="font-semibold">Lembre-se também de remover o nome da primeira formação, você entenderá mais a frente.</span>
        </p>
        <CodeBlock
            language="typescript"
            code='

    // types.ts

    // 👇 Nomes das formações exportadas aqui
    export type TaticPositionName =
    //  | INITIAL_POSITIONS
        | "LEFT_DEFENSIVE"
        | "CENTER_DEFENSIVE"
        | "RIGHT_DEFENSIVE"
        | "LEFT_DEFENSIVE_MIDFIELD"
        | "CENTER_DEFENSIVE_MIDFIELD"
        | "RIGHT_DEFENSIVE_MIDFIELD"
        | "LEFT_OFENSIVE_MIDFIELD"
        | "CENTER_OFENSIVE_MIDFIELD"
        | "RIGHT_OFENSIVE_MIDFIELD"
        | "LEFT_OFENSIVE"
        | "CENTER_OFENSIVE"
        | "RIGHT_OFENSIVE";

    export type FieldZone = { start_col: number; end_col: number; start_row: number; end_row: number; id: TaticPositionName };

    export type PlayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 8 | 9 | 10 | 11;

    export type PlayerNumberWithoutGoalkeeper = Exclude<PlayerNumber, 1>;

    export type InitialTaticPositions = { [key in PlayerNumber]: { col: number; row: number } };

    export type TaticPositions = { [key in PlayerNumberWithoutGoalkeeper]: { col: number; row: number } };

    export type AllTaticPositions = { [key in TaticPositionName]: TaticPositions };

    '
        />
        <h2>3. Definindo as formações e as zonas de campo</h2>
        <p>Agora que definimos os tipos, devemos definir as formações e zonas de campo.</p>
        <h3>Definindo as formações</h3>
        <p>
            Primeira coisa a se fazer é exportar as formações da sua estratégia usando <code>Exportar Formações</code> e copiar o conteúdo do arquivo json, logo após isso se você estiver com typescript configurado será mais fácil, basta escrever o código abaixo e importando corretamente os tipos e
            depois colocar o conteúdo do arquivo json após o sinal de <code>=</code> e ele irá se formatar sozinho.
        </p>
        <CodeBlock
            language="typescript"
            code="

    // tatic-positions.ts

    export const TACTIC_POSITIONS: AllTaticPositions = // Cole o conteúdo aqui
   "
        />
        <p>Se der tudo certo ficará algo parecido com isso.</p>
        <CodeBlock
            language="typescript"
            code='

    // tatic-positions.ts

    export const TACTIC_POSITIONS: AllTaticPositions = {
        // INITIAL_POSITIONS: { "2": { col: 5, row: 10 }, "3": { col: 3, row: 7 }, "4": { col: 3, row: 4 }, "5": { col: 5, row: 1 }, "6": { col: 5, row: 8 }, "7": { col: 5, row: 3 }, "8": { col: 7, row: 10 }, "9": { col: 6, row: 6 }, "10": { col: 6, row: 5 }, "11": { col: 7, row: 1 } },
        LEFT_DEFENSIVE: { "2": { col: 0, row: 11 }, "3": { col: 0, row: 8 }, "4": { col: 1, row: 8 }, "5": { col: 3, row: 8 }, "6": { col: 2, row: 11 }, "7": { col: 2, row: 8 }, "8": { col: 1, row: 11 }, "9": { col: 3, row: 11 }, "10": { col: 3, row: 9 }, "11": { col: 0, row: 10 } },
        CENTER_DEFENSIVE: { "2": { col: 1, row: 7 }, "3": { col: 0, row: 7 }, "4": { col: 1, row: 4 }, "5": { col: 0, row: 4 }, "6": { col: 3, row: 7 }, "7": { col: 3, row: 4 }, "8": { col: 2, row: 7 }, "9": { col: 3, row: 5 }, "10": { col: 0, row: 6 }, "11": { col: 2, row: 4 } },
        RIGHT_DEFENSIVE: { "2": { col: 1, row: 3 }, "3": { col: 2, row: 3 }, "4": { col: 0, row: 0 }, "5": { col: 0, row: 2 }, "6": { col: 3, row: 3 }, "7": { col: 1, row: 0 }, "8": { col: 0, row: 3 }, "9": { col: 3, row: 0 }, "10": { col: 2, row: 0 }, "11": { col: 3, row: 1 } },
        LEFT_DEFENSIVE_MIDFIELD: { "2": { col: 4, row: 11 }, "3": { col: 4, row: 9 }, "4": { col: 4, row: 8 }, "5": { col: 6, row: 8 }, "6": { col: 5, row: 11 }, "7": { col: 5, row: 8 }, "8": { col: 7, row: 11 }, "9": { col: 6, row: 11 }, "10": { col: 7, row: 10 }, "11": { col: 7, row: 8 } },
        CENTER_DEFENSIVE_MIDFIELD: { "2": { col: 7, row: 5 }, "3": { col: 4, row: 7 }, "4": { col: 4, row: 6 }, "5": { col: 4, row: 4 }, "6": { col: 5, row: 7 }, "7": { col: 6, row: 4 }, "8": { col: 6, row: 7 }, "9": { col: 7, row: 7 }, "10": { col: 7, row: 4 }, "11": { col: 5, row: 4 } },
        RIGHT_DEFENSIVE_MIDFIELD: { "2": { col: 7, row: 3 }, "3": { col: 7, row: 2 }, "4": { col: 4, row: 1 }, "5": { col: 4, row: 0 }, "6": { col: 4, row: 3 }, "7": { col: 5, row: 0 }, "8": { col: 5, row: 3 }, "9": { col: 6, row: 3 }, "10": { col: 6, row: 0 }, "11": { col: 7, row: 0 } },
        LEFT_OFENSIVE_MIDFIELD: { "2": { col: 9, row: 11 }, "3": { col: 8, row: 11 }, "4": { col: 8, row: 9 }, "5": { col: 8, row: 8 }, "6": { col: 10, row: 11 }, "7": { col: 9, row: 8 }, "8": { col: 11, row: 11 }, "9": { col: 11, row: 10 }, "10": { col: 10, row: 8 }, "11": { col: 11, row: 8 } },
        CENTER_OFENSIVE_MIDFIELD: { "2": { col: 8, row: 7 }, "3": { col: 8, row: 5 }, "4": { col: 8, row: 4 }, "5": { col: 9, row: 4 }, "6": { col: 9, row: 7 }, "7": { col: 10, row: 4 }, "8": { col: 10, row: 7 }, "9": { col: 11, row: 7 }, "10": { col: 11, row: 6 }, "11": { col: 11, row: 4 } },
        RIGHT_OFENSIVE_MIDFIELD: { "2": { col: 9, row: 0 }, "3": { col: 8, row: 1 }, "4": { col: 11, row: 2 }, "5": { col: 8, row: 0 }, "6": { col: 9, row: 3 }, "7": { col: 8, row: 3 }, "8": { col: 11, row: 3 }, "9": { col: 10, row: 3 }, "10": { col: 10, row: 0 }, "11": { col: 11, row: 0 } },
        LEFT_OFENSIVE: { "2": { col: 13, row: 11 }, "3": { col: 12, row: 11 }, "4": { col: 12, row: 8 }, "5": { col: 15, row: 8 }, "6": { col: 14, row: 11 }, "7": { col: 14, row: 8 }, "8": { col: 15, row: 11 }, "9": { col: 12, row: 10 }, "10": { col: 13, row: 8 }, "11": { col: 15, row: 9 } },
        CENTER_OFENSIVE: { "2": { col: 12, row: 7 }, "3": { col: 12, row: 6 }, "4": { col: 12, row: 4 }, "5": { col: 13, row: 4 }, "6": { col: 13, row: 7 }, "7": { col: 14, row: 4 }, "8": { col: 14, row: 7 }, "9": { col: 15, row: 7 }, "10": { col: 15, row: 5 }, "11": { col: 15, row: 4 } },
        RIGHT_OFENSIVE: { "2": { col: 12, row: 3 }, "3": { col: 12, row: 1 }, "4": { col: 12, row: 0 }, "5": { col: 13, row: 0 }, "6": { col: 13, row: 3 }, "7": { col: 14, row: 0 }, "8": { col: 15, row: 0 }, "9": { col: 14, row: 3 }, "10": { col: 15, row: 2 }, "11": { col: 15, row: 3 } },
    };
   '
        />
        <p>Remova a formação inicial do objeto, pois ela é um pouco diferente porque precisa da posição do goleiro, caso contrário o servidor do game acusara um erro. Então crie uma constante como mostrado a baixo.</p>
        <CodeBlock
            language="typescript"
            code='

    // tatic-positions.ts

    export const INITIAL_POSITIONS: InitialTaticPositions = {
        "1": { col: 0, row: 0 }, // Não esqueça de adicionar a posição do goleiro 0 e 0 já funciona
        "2": { col: 5, row: 10 },
        "3": { col: 3, row: 7 },
        "4": { col: 3, row: 4 },
        "5": { col: 5, row: 1 },
        "6": { col: 5, row: 8 },
        "7": { col: 5, row: 3 },
        "8": { col: 7, row: 10 },
        "9": { col: 6, row: 6 },
        "10": { col: 6, row: 5 },
        "11": { col: 7, row: 1 },
    };
   '
        />
        <h3>Definindo as zonas de campo</h3>
        <p>Agora vamos exportar as zonas de campo usando o botão <code>Exportar Zonas de campo</code> e copiar o conteúdo. Novamente se tiver configurado o typescript escreva o código abaixo e cole o conteúdo após <code>=</code></p>
        <CodeBlock
            language="typescript"
            code="

    // tatic-positions.ts

    export const ZONES: FieldZone[] = // Cole o conteúdo aqui
   "
        />
        <p>Se der tudo certo ficará algo parecido com isso.</p>
        <CodeBlock
            language="typescript"
            code='

    // tatic-positions.ts

    export const ZONES: FieldZone[] = [
        { start_col: 0, end_col: 3, start_row: 8, end_row: 11, id: "LEFT_DEFENSIVE" },
        { start_col: 0, end_col: 3, start_row: 4, end_row: 7, id: "CENTER_DEFENSIVE" },
        { start_col: 0, end_col: 3, start_row: 0, end_row: 3, id: "RIGHT_DEFENSIVE" },
        { start_col: 4, end_col: 7, start_row: 8, end_row: 11, id: "LEFT_DEFENSIVE_MIDFIELD" },
        { start_col: 4, end_col: 7, start_row: 4, end_row: 7, id: "CENTER_DEFENSIVE_MIDFIELD" },
        { start_col: 4, end_col: 7, start_row: 0, end_row: 3, id: "RIGHT_DEFENSIVE_MIDFIELD" },
        { start_col: 8, end_col: 11, start_row: 8, end_row: 11, id: "LEFT_OFENSIVE_MIDFIELD" },
        { start_col: 8, end_col: 11, start_row: 4, end_row: 7, id: "CENTER_OFENSIVE_MIDFIELD" },
        { start_col: 8, end_col: 11, start_row: 0, end_row: 3, id: "RIGHT_OFENSIVE_MIDFIELD" },
        { start_col: 12, end_col: 15, start_row: 8, end_row: 11, id: "LEFT_OFENSIVE" },
        { start_col: 12, end_col: 15, start_row: 4, end_row: 7, id: "CENTER_OFENSIVE" },
        { start_col: 12, end_col: 15, start_row: 0, end_row: 3, id: "RIGHT_OFENSIVE" },
    ];
   '
        />
        <h2>4. Definindo as funções auxiliares</h2>
        <p>Agora que já temos os tipos, formações e zonas definidas, vamos crias as funções auxiliares que vão nos permitir saber a zona atual, posição do jogador nessa zona entre outras coisas. Adicionei comentários em cada função para você entender melhor.</p>
        <CodeBlock
            language="typescript"
            code='

    // positions-helper.ts

    import { Lugo, Mapper, Region } from "@lugobots/lugo4node";
    import { Ball } from "@lugobots/lugo4node/dist/proto_exported";
    import { FieldZone, PlayerNumberWithoutGoalkeeper } from "./types";
    import { MAPPER_COLS, MAPPER_ROWS } from "./settings";
    import { TACTIC_POSITIONS, ZONES } from "./tatic-positions";

    // Retorna a posição esperada do jogador na zona de campo atual onde a bola está
    export function getMyExpectedPositionInTheField(ball: Ball, myNumber: number, mapper: Mapper): Lugo.Point {
        const fieldZone = getFieldZoneFromPoint(ball.getPosition(), mapper);
        const playerPositionInZone = TACTIC_POSITIONS[fieldZone.id][myNumber as PlayerNumberWithoutGoalkeeper];
        const expectedRegion = mapper.getRegion(playerPositionInZone.col, playerPositionInZone.row);

        return expectedRegion.getCenter();
    }

    // Retorna a zona de campo a qual esse ponto específico faz parte
    export function getFieldZoneFromPoint(point: Lugo.Point, mapper: Mapper): FieldZone {
        return getFieldZoneByRegion(mapper.getRegionFromPoint(point));
    }

    // Retorna a zona do campo que essa região faz parte
    export function getFieldZoneByRegion(region: Region): FieldZone {
        return getFieldZoneByColAndRow(region.getCol(), region.getRow());
    }

    // Retorna a zone de campo que contém a coluna e linha passada na função
    export function getFieldZoneByColAndRow(col: number, row: number): FieldZone {
        col = col < 0 ? 0 : col > MAPPER_COLS ? MAPPER_COLS : col;
        row = row < 0 ? 0 : row > MAPPER_ROWS ? MAPPER_ROWS : row;
        const zone = ZONES.find((zone) => col >= zone.start_col && col <= zone.end_col && row >= zone.start_row && row <= zone.end_row);

        // No meu caso eu uso as zonas de campo para cobrir todo o campo de futebol, ou seja sempre que tiver um ponto onde não há uma zona de campo eu quero saber.
        // Você pode retornar undefined ou null nessa função porem terá que alterar todas as outras e fazer uma checagem ao buscar a posição esperada
        if (!zone) throw new Error("Não existe nenhuma zona para esse ponto.");

        return zone;
    }
   '
        />
        <h2>5. Definindo a posições iniciais no bot</h2>
        <p>Para fazer isso basta abrir o arquivo <code>main.ts</code> do seu bot e alterar <code>initialRegion</code> para o código abaixo.</p>
        <CodeBlock
            language="typescript"
            code='

    // main.ts

    import { INITIAL_POSITIONS } from "./tatic-positions";
    import { PlayerNumber } from "./types";

    const initialRegion = mapper.getRegion(INITIAL_POSITIONS[config.getBotNumber() as PlayerNumber].col, INITIAL_POSITIONS[config.getBotNumber() as PlayerNumber].row);
   '
        />
        <h2>6. Finalmente pegando a posição do bot com base na zona atual que a bola está</h2>
        <p>Para pegar a posição esperada se baseando na zona basta usar a função <code>getMyExpectedPositionInTheField()</code> que escrevemos em <code>positions-helper.ts</code>. Exemplo abaixo.</p>
        <CodeBlock
            language="typescript"
            code='

    // myt_bot.ts

    import { getMyExpectedPositionInTheField } from "./positions-helper";

    onDefending(orderSet: Lugo.OrderSet, snapshot: Lugo.GameSnapshot): Lugo.OrderSet {
        try {
            const { reader, me } = this.makeReader(snapshot);

            // Posição que eu devo estar
            let moveDestination = getMyExpectedPositionInTheField(reader.getBall(), this.number, this.mapper);

            const moveOrder = reader.makeOrderMoveMaxSpeed(me.getPosition(), moveDestination);
            const catchOrder = reader.makeOrderCatch();

            orderSet.setOrdersList([moveOrder, catchOrder]);
            return orderSet;
        } catch (e) {
            console.log(`did not play this turn`, e);
        }
    }
   '
        />
        <p>Você pode ver a implementação deste projeto de exemplo no <a href="https://github.com/MauricioRobertoDev/noobzin-bot" target="_blank" rel="noopener noreferrer">github</a>.</p>
        <div class="relative flex flex-col items-center justify-center gap-4 pt-20 pb-20">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/MauricioRobertoDev">
                <img class="w-12 h-12 my-0" src="./../assets/mauricio.svg" alt="" srcset="" />
            </a>
            Mauricio Roberto
        </div>
    </article>
</template>

<style scoped></style>
