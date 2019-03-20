<template>
    <div id="drop-down">
        <div>
            <span>是否报名：</span>
            <label><input type="radio" v-model="radio" value="1" name="a">1</label>
            <label><input type="radio" v-model="radio" value="2" name="a">2</label>
            <label><input type="radio" v-model="radio" value="1" name="a">1</label>
            <label><input type="radio" v-model="radio" value="2" name="a">2</label>
        </div>
        <div>
            <span>是否报名：</span>
            <select>
            <option>Volvo</option>
            <option>Saab</option>
            <option>Mercedes</option>
            <option>Audi</option>
            </select>
        </div>

    </div>
</template>

<script>
export default {
  date(){
    
  }
}
</script>

