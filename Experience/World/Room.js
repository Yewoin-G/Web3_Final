import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.rotation = 0;
        this.originalRotation = 0; // Store original rotation
        this.setModel();

        this.onMouseWheel();
    }

    setModel() {
        this.actualRoom.children.forEach(child => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach(groupchild => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }

            if (child.name === "Aquarium") {
                child.children[0].material = new THREE.MeshPhysicalMaterial();
                child.children[0].material.roughness = 0;
                child.children[0].material.color.set(0x549dd2);
                child.children[0].material.ior = 3;
                child.children[0].material.transmission = 1;
                child.children[0].material.opacity = 1;
                child.children[0].material.depthWrite = false;
                child.children[0].material.depthTest = false;
            }
            

            if (child.name === "Computer") {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }
            if (child.name === "Computer2") {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen01,
                });
            }
            if (child.name === "Computer2") {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }
            if (child.name === "Computer4") {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }

        });

        const width = 0.5;
        const height = 0.4;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
        rectLight.position.set(7.68244, 7, 0.4);
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = -Math.PI / 4;

        this.actualRoom.add(rectLight);

        this.scene.add(this.actualRoom);

        this.actualRoom.scale.set(0.11, 0.11, 0.11);
    }

    onMouseWheel() {
        window.addEventListener("wheel", (e) => {
            const scrollAmount = e.deltaY * 0.001; // Adjust the rotation speed

            // If scrolling up, allow rotation
            if (scrollAmount < 0) {
                this.rotation += scrollAmount;
                this.lerp.target = this.rotation;
            } else {
                // If scrolling down, reset to original position and stop scrolling
                this.lerp.target = this.originalRotation;
            }
        });
    }

    resize() {
        
    }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        this.actualRoom.rotation.y = this.lerp.current;
    }
}
