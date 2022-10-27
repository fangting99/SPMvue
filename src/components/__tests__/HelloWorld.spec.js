import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import HelloWorld from "../HelloWorld.vue";

describe("HelloWorld", () => {
  it("renders properly", () => {
    const wrapper = mount(HelloWorld,{
      propsData: {
        Department: ''
      }
    
    })
    const byId = wrapper.find('#submitBTN')
    //CLICK id submitBTN
    expect(byId.element.id).toBe('submitBTN')    
    expect(wrapper.vm.Department).toBe('bar');
  
  });
});
