<template>
    <div class="mt-20 w-full flex justify-center">
        <div class="w-1/4">
            <ul class="divide-y border rounded">
                <li
                    v-for="i of 10"
                    :key="i"
                >
                    <div>
                        {{ i }}
                    </div>
                    <div>
                        {{ i }}
                    </div>
                    <div class="text-right">
                        <i class="fas fa-times" />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
li {
    @apply flex justify-between;
    & > div {
        @apply flex p-4;
    }
}
</style>