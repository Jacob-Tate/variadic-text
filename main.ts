function showLongText_(str: string, layout: DialogLayout) {
        controller._setUserEventsEnabled(false);
        game.pushScene();
        game.currentScene().flags |= scene.Flag.SeeThrough;

        let width: number;
        let height: number;
        let top: number;
        let left: number;

        switch (layout) {
            case DialogLayout.Bottom:
                width = screen.width - 4;
                height = Math.idiv(screen.height, 3) + 5;
                top = screen.height - height;
                left = screen.width - width >> 1;
                break;
            case DialogLayout.Top:
                width = screen.width - 4;
                height = Math.idiv(screen.height, 3) + 5;
                top = 0;
                left = screen.width - width >> 1;
                break;
            case DialogLayout.Left:
                width = Math.idiv(screen.width, 3) + 5;
                height = screen.height;
                top = 0;
                left = 0;
                break;
            case DialogLayout.Right:
                width = Math.idiv(screen.width, 3) + 5;
                height = screen.height;
                top = 0;
                left = screen.width - width;
                break;
            case DialogLayout.Center:
                width = Math.idiv(screen.width << 1, 3);
                height = Math.idiv(screen.width << 1, 3);
                top = (screen.height - height) >> 1;
                left = (screen.width - width) >> 1;
                break;
            case DialogLayout.Full:
                width = screen.width;
                height = screen.height;
                top = 0;
                left = 0;
                break;
        }

        const dialog = new game.Dialog(width, height);
        const s = sprites.create(dialog.image, -1);
        s.top = top;
        s.left = left;

        dialog.setText(str)
        let pressed = true;
        let done = false;

        let upPressed = true;

        game.onUpdate(() => {
            dialog.update();
            const currentState = controller.A.isPressed() || controller.down.isPressed();
            if (currentState && !pressed) {
                pressed = true;
                if (dialog.hasNext()) {
                    dialog.nextPage();
                }
                else {
                    scene.setBackgroundImage(null); // GC it
                    game.popScene();
                    done = true;
                }
            }
            else if (pressed && !currentState) {
                pressed = false;
            }

            const moveBack = controller.up.isPressed();
            if (moveBack && !upPressed) {
                upPressed = true;
                if (dialog.hasPrev()) {
                    dialog.prevPage();
                }
            }
            else if (upPressed && !moveBack) {
                upPressed = false;
            }
        })

        pauseUntil(() => done);
        controller._setUserEventsEnabled(true);
    }
