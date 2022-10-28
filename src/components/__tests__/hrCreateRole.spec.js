import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import hrCreateRole from "../hrCreateRole.vue";

describe("hrCreateRole", () => {
  it("renders properly", () => {
    const wrapper = mount(hrCreateRole,{
      propsData: {
        Department: 'bar'
      }
    
    })
    const byId = wrapper.find('#submitBTN')
    //CLICK id submitBTN
    expect(byId.element.id).toBe('submitBTN')    
    expect(wrapper.vm.Department).toBe('bar');
  
  });
});
