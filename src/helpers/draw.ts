import { Paint, Vector2D } from "@mauricioroberto/math-world";
import { FIELD_HEIGHT, FIELD_POINT_1, FIELD_POINT_CENTER, FIELD_WIDTH, GOAL_RADIUS, HOME_GOAL_BOTTOM, HOME_GOAL_CENTER, HOME_GOAL_TOP, AWAY_GOAL_BOTTOM, AWAY_GOAL_CENTER, AWAY_GOAL_TOP, CENTER_FIELD_RADIUS } from "./constants";
import global from "../global";
import { angleInRadians, getDirectionToVector, radiansToDegrees } from "./math";
import PlayerContract from "../contracts/player-contract";
import { isPermittedFieldZone } from "./field";

export function drawField(paint: Paint): void {
    const COLOR_RED = paint.getTailwindColor("Red");
    const COLOR_RED_WITH_OPACITY = paint.getTailwindColor("Red", "500", 10);

    // LINHAS LATERAIS
    paint.rect({ point: FIELD_POINT_1, width: FIELD_WIDTH, height: -FIELD_HEIGHT, lineWidth: 20 });

    // LINHA DO CENTRO
    paint.line({ startPoint: { x: FIELD_POINT_CENTER.x, y: 0 }, endPoint: { x: FIELD_POINT_CENTER.x, y: FIELD_HEIGHT }, lineWidth: 10 });

    // PONTO DO CENTRO
    paint.circle({ point: FIELD_POINT_CENTER, radius: 50, lineWidth: 10, fillColor: "white" });

    // CÍRCULO DO CENTRO
    paint.circle({ point: FIELD_POINT_CENTER, radius: CENTER_FIELD_RADIUS, lineWidth: 10 });

    // GOL HOME
    paint
        .line({ startPoint: { x: HOME_GOAL_TOP.getX() - 70, y: HOME_GOAL_TOP.getY() }, endPoint: { x: HOME_GOAL_TOP.getX() + 70, y: HOME_GOAL_TOP.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: HOME_GOAL_CENTER.getX() - 70, y: HOME_GOAL_CENTER.getY() }, endPoint: { x: HOME_GOAL_CENTER.getX() + 70, y: HOME_GOAL_CENTER.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: HOME_GOAL_BOTTOM.getX() - 70, y: HOME_GOAL_BOTTOM.getY() }, endPoint: { x: HOME_GOAL_BOTTOM.getX() + 70, y: HOME_GOAL_BOTTOM.getY() }, lineWidth: 20 });

    paint.line({ startPoint: { x: 1400, y: HOME_GOAL_TOP.getY() }, endPoint: { x: 1400, y: HOME_GOAL_BOTTOM.getY() }, lineWidth: 20 });
    paint.circle({ point: HOME_GOAL_TOP, radius: GOAL_RADIUS, startAngleForHumans: 0, endAngleForHumans: 90, lineWidth: 20 });
    paint.circle({ point: HOME_GOAL_BOTTOM, radius: GOAL_RADIUS, startAngleForHumans: 270, endAngleForHumans: 360, lineWidth: 20 });

    // GOL AWAY
    paint
        .line({ startPoint: { x: AWAY_GOAL_TOP.getX() - 70, y: AWAY_GOAL_TOP.getY() }, endPoint: { x: AWAY_GOAL_TOP.getX() + 70, y: AWAY_GOAL_TOP.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: AWAY_GOAL_CENTER.getX() - 70, y: AWAY_GOAL_CENTER.getY() }, endPoint: { x: AWAY_GOAL_CENTER.getX() + 70, y: AWAY_GOAL_CENTER.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: AWAY_GOAL_BOTTOM.getX() - 70, y: AWAY_GOAL_BOTTOM.getY() }, endPoint: { x: AWAY_GOAL_BOTTOM.getX() + 70, y: AWAY_GOAL_BOTTOM.getY() }, lineWidth: 20 });

    paint.line({ startPoint: { x: FIELD_WIDTH - 1400, y: AWAY_GOAL_TOP.getY() }, endPoint: { x: FIELD_WIDTH - 1400, y: AWAY_GOAL_BOTTOM.getY() }, lineWidth: 20 });
    paint.circle({ point: AWAY_GOAL_TOP, radius: GOAL_RADIUS, startAngleForHumans: 90, endAngleForHumans: 180, lineWidth: 20 });
    paint.circle({ point: AWAY_GOAL_BOTTOM, radius: GOAL_RADIUS, startAngleForHumans: 180, endAngleForHumans: 270, lineWidth: 20 });

    // SE O TIPO DA FORMAÇÃO FOR INICIAL TODO O LADO DO ADVERSÁRIO É BLOQUEADO, EXIBIMOS ISSO PINTANDO DE VERMELHO
    if (global.currentFormationTypeIs("INITIAL_POSITIONS")) {
        paint.rect({ point: new Vector2D(global.isHomeSide() ? FIELD_POINT_CENTER.x : 0, FIELD_HEIGHT), width: FIELD_WIDTH / 2, height: FIELD_HEIGHT, strokeColor: COLOR_RED, lineWidth: 20, fillColor: COLOR_RED_WITH_OPACITY });

        // BORDA VERMELHA DO CÍRCULO CENTRAL
        paint.circle({ point: FIELD_POINT_CENTER, radius: CENTER_FIELD_RADIUS, lineWidth: 20, strokeColor: COLOR_RED, fillColor: "transparent" });

        // BLOQUEIO DO CÍRCULO CENTRAL LADO HOME
        if (global.isHomeSide()) paint.circle({ point: FIELD_POINT_CENTER, radius: CENTER_FIELD_RADIUS, startAngle: Math.PI * 2.5, endAngle: Math.PI * 1.5, fillColor: COLOR_RED_WITH_OPACITY, lineToCenter: true });

        // BLOQUEIO DO CÍRCULO CENTRAL LADO AWAY
        if (global.isAwaySide()) paint.circle({ point: FIELD_POINT_CENTER, radius: CENTER_FIELD_RADIUS, startAngle: -Math.PI * 2.5, endAngle: -Math.PI * 1.5, fillColor: COLOR_RED_WITH_OPACITY, lineToCenter: true });
    }

    if (global.currentFormationTypeIs("INITIAL_POSITIONS") || global.getCurrentStrategy().getCurrentFormation().getBlockGoalArea()) {
        let fillColor = COLOR_RED_WITH_OPACITY;

        // BLOQUEIO DO GOL HOME
        if (global.currentFormationTypeIs("INITIAL_POSITIONS")) if (global.isAwaySide()) fillColor = "transparent";
        paint.circle({ point: HOME_GOAL_TOP, radius: GOAL_RADIUS, startAngle: 0, endAngle: Math.PI * 1.5, lineWidth: 20, strokeColor: COLOR_RED, fillColor: fillColor, lineToCenter: true, clockwise: true });
        paint.circle({ point: HOME_GOAL_BOTTOM, radius: GOAL_RADIUS, startAngle: 0, endAngle: Math.PI / 2, lineWidth: 20, strokeColor: COLOR_RED, fillColor: fillColor, lineToCenter: true });
        paint.line({ startPoint: HOME_GOAL_TOP, endPoint: HOME_GOAL_BOTTOM, lineWidth: 20, strokeColor: COLOR_RED });
        paint.line({ startPoint: HOME_GOAL_TOP.clone().add({ x: GOAL_RADIUS, y: 0 }), endPoint: HOME_GOAL_BOTTOM.clone().add({ x: GOAL_RADIUS, y: 0 }), lineWidth: 20, strokeColor: COLOR_RED });
        paint.rect({ point: HOME_GOAL_TOP, width: GOAL_RADIUS, height: 3000, fillColor: fillColor, strokeColor: "transparent" });

        fillColor = COLOR_RED_WITH_OPACITY;

        // BLOQUEIO DO GOL AWAY
        if (global.currentFormationTypeIs("INITIAL_POSITIONS")) if (global.isHomeSide()) fillColor = "transparent";
        paint.circle({ point: AWAY_GOAL_TOP, radius: GOAL_RADIUS, startAngle: Math.PI, endAngle: Math.PI * 1.5, lineWidth: 20, strokeColor: COLOR_RED, fillColor: fillColor, lineToCenter: true });
        paint.circle({ point: AWAY_GOAL_BOTTOM, radius: GOAL_RADIUS, startAngle: Math.PI, endAngle: Math.PI / 2, lineWidth: 20, strokeColor: COLOR_RED, fillColor: fillColor, lineToCenter: true, clockwise: true });
        paint.line({ startPoint: AWAY_GOAL_TOP, endPoint: AWAY_GOAL_BOTTOM, lineWidth: 20, strokeColor: COLOR_RED });
        paint.line({ startPoint: AWAY_GOAL_TOP.clone().sub({ x: GOAL_RADIUS, y: 0 }), endPoint: AWAY_GOAL_BOTTOM.clone().sub({ x: GOAL_RADIUS, y: 0 }), lineWidth: 20, strokeColor: COLOR_RED });
        paint.rect({ point: AWAY_GOAL_TOP.clone().sub({ x: GOAL_RADIUS, y: 0 }), width: GOAL_RADIUS, height: 3000, fillColor: fillColor, strokeColor: "transparent" });
    }
}

export function drawRegions(paint: Paint): void {
    for (let col = 0; col < global.getCols(); col++) {
        for (let row = 0; row < global.getRows(); row++) {
            const x = global.isHomeSide() ? col * global.getRegionWidth() : FIELD_WIDTH - (col + 1) * global.getRegionWidth();
            const y = global.isHomeSide() ? row * global.getRegionHeight() : FIELD_HEIGHT - (row + 1) * global.getRegionHeight();

            paint.rect({ point: { x: x, y: y + global.getRegionHeight() }, width: global.getRegionWidth(), height: global.getRegionHeight(), strokeColor: "rgba(255, 255, 255, 0.2)" });
            paint.text({ point: { x: x + global.getRegionWidth() / 2, y: y + global.getRegionHeight() / 2 }, textSize: 175, text: `${col}x${row}`, textColor: "rgba(255, 255, 255, 0.2)" });
        }
    }
}

export function drawPlayers(paint: Paint): void {
    // CORES
    const COLOR_GREEN = paint.getTailwindColor("Green");
    const COLOR_RED = paint.getTailwindColor("Red");
    const COLOR_YELLOW = paint.getTailwindColor("Yellow");

    // DESENHANDO OS JOGADORES
    global.getPlayers().forEach((player) => {
        // ATUALIZANDO A DIREÇÃO DO JOGADOR PARA DESENHAR CORRETAMENTE
        player.setDirection(getDirectionToVector(player.getPosition(), global.isHomeSide() ? AWAY_GOAL_CENTER : HOME_GOAL_CENTER));

        // SE É O JOGADOR ABAIXO DO MOUSE VAMOS DESENHAR UM CÍRCULO EM VOLTA PARA O USUÁRIO POSSA SABER MAIS FACILMENTE QUAL ELE IRÁ MOVER
        if (global.hasPlayerUnderMouse() && global.getPlayerUnderMouse() === player) {
            paint.circle({ point: player.getPosition(), radius: player.getRadius() + 20, lineWidth: 150, strokeColor: player.hasColAndRow() ? COLOR_GREEN : COLOR_YELLOW });
        }

        // SE FOR O JOGADOR SEGURADO VAMOS APENAS DESENHAR UM CÍRCULO NELE
        if (global.hasHoldedPlayer() && global.getHoldedPlayer().player === player) {
            const region = global.getHoldedPlayer().region;
            const allowedRegion = global.getHoldedPlayer().is_permitted_region;

            const color = allowedRegion ? COLOR_GREEN : COLOR_RED;

            if (region) {
                // O CÍRCULO COM COR PRA O USUÁRIO ENTENDER A SITUAÇÃO
                paint.circle({ point: player.getPosition(), radius: player.getRadius() + 20, lineWidth: 150, strokeColor: color });
                // A COLUNA E LINHA QUE O USUÁRIO TERÁ CASO SEJA DROPADO NESSE PONTO
                paint.text({ point: player.getPosition().clone().add({ x: 0, y: 500 }), text: `${region.getCol()}x${region.getRow()}`, textSize: 300, textColor: color });
                // UM RETÂNGULO MARCANDO A REGIÃO PARA O USUÁRIO SABER
                paint.rect({ point: { x: region.getStart().getX(), y: region.getEnd().getY() }, width: region.getWidth(), height: region.getHeight(), lineWidth: 20, strokeColor: color });
            }

            // SE NÃO TIVER UMA ENCONTRADO UMA REGIÃO SIGNIFICA QUE ESTÁ FORA DO CAMPO E TERÁ SUA POSIÇÃO RESETADA, MOSTRE ISSO COMM UM CÍRCULO VERMELHO
            if (!region) paint.circle({ point: player.getPosition(), radius: player.getRadius() + 20, lineWidth: 150, strokeColor: COLOR_RED });
        }

        // SE TIVER ATIVO A OPÇÃO DE MOSTRAR AS COLUNAS E LINHAS E O JOGADOR NÃO ESTÁ SENDO SEGURADO... MOSTRE AS COLUNAS E LINHAS
        if (player.hasColAndRow() && global.showColsAndRows() && (!global.hasHoldedPlayer() || (global.hasHoldedPlayer() && global.getHoldedPlayer().player != player))) {
            paint.text({ point: player.getPosition().clone().add({ x: 0, y: 500 }), text: `${player.getCol()}x${player.getRow()}`, textSize: 300, textColor: player.getColor() });
        }

        // DESENHANDO O JOGADOR DE FATO
        drawPlayer(player, paint);
    });

    // ATUALIZANDO A DIREÇÃO DO GOLEIRO PARA DESENHAR CORRETAMENTE
    global.getGoalkeeper().setDirection(getDirectionToVector(global.getGoalkeeper().getPosition(), global.isHomeSide() ? AWAY_GOAL_CENTER : HOME_GOAL_CENTER));

    // DESENHANDO O GOLEIRO
    drawPlayer(global.getGoalkeeper(), paint);
}

function drawPlayer(player: PlayerContract, paint: Paint): void {
    const ANGLE = radiansToDegrees(angleInRadians(player.getDirection()));

    paint.circle({ point: player.getPosition(), radius: player.getRadius(), fillColor: player.getColor(), strokeColor: "white", lineWidth: 30 });
    paint.circle({ point: player.getPosition(), radius: player.getRadius(), fillColor: "white", startAngleForHumans: ANGLE - 30, endAngleForHumans: ANGLE + 30, lineToCenter: true });
    paint.circle({ point: player.getPosition(), radius: player.getRadius() * 0.6, fillColor: "white", strokeColor: player.getColor(), lineWidth: 30 });
    paint.text({ point: player.getPosition().clone().sub({ x: 0, y: 20 }), text: player.getNumber().toString(), textColor: player.getColor(), textSize: 250, textAlign: "center" });
}

export function drawFieldZones(paint: Paint): void {
    if (global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) {
        const zone = global.getTemporaryZone();

        if (isPermittedFieldZone(zone.getDefinition())) {
            const borderColor = `rgb(${zone.getColor().r}, ${zone.getColor().g}, ${zone.getColor().b})`;
            const fillColor = `rgb(${zone.getColor().r}, ${zone.getColor().g}, ${zone.getColor().b}, 0.3)`;
            paint.rect({ point: zone.getTopLeft(), width: zone.getWidth(), height: zone.getHeight(), lineWidth: 20, strokeColor: borderColor, fillColor });
            paint.text({ point: zone.getCenter(), text: global.getCurrentStrategy().getCurrentFormation().getName(), textSize: 200, textColor: "white" });
        }
    }

    if ((global.getCurrentStrategy().getCurrentFormation().hasFieldZone() && !global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) || (global.getCurrentStrategy().getCurrentFormation().hasFieldZone() && global.showFieldZones())) {
        const zone = global.getCurrentStrategy().getCurrentFormation().getFieldZone();
        const borderColor = `rgb(${zone.getColor().r}, ${zone.getColor().g}, ${zone.getColor().b})`;
        const fillColor = `rgb(${zone.getColor().r}, ${zone.getColor().g}, ${zone.getColor().b}, 0.3)`;
        paint.rect({ point: zone.getTopLeft(), width: zone.getWidth(), height: zone.getHeight(), lineWidth: 20, strokeColor: borderColor, fillColor });
        paint.text({ point: zone.getCenter(), text: global.getCurrentStrategy().getCurrentFormation().getName(), textSize: 200, textColor: "white" });
    }

    if (global.showFieldZones() || global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) {
        global
            .getCurrentStrategy()
            .getFormationsWithFieldZones()
            .filter((formation) => {
                if (global.getCurrentStrategy().getCurrentFormation().hasFieldZone()) {
                    if (formation.getFieldZone().getUuid() === global.getCurrentStrategy().getCurrentFormation().getFieldZone().getUuid()) return false;
                }
                return true;
            })
            .forEach((formation) => {
                const zone = formation.getFieldZone();
                const borderColor = `rgb(${zone.getColor().r}, ${zone.getColor().g}, ${zone.getColor().b})`;
                const fillColor = `rgb(${zone.getColor().r}, ${zone.getColor().g}, ${zone.getColor().b}, 0.3)`;
                paint.rect({ point: zone.getTopLeft(), width: zone.getWidth(), height: zone.getHeight(), lineWidth: 20, strokeColor: borderColor, fillColor });
                paint.text({ point: zone.getCenter(), text: formation.getName(), textSize: 200, textColor: "white" });
            });
    }
}
