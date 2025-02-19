import { FC } from 'react';
import { Flex, TextField, Section, Button, Text } from "@radix-ui/themes"
import { sLoginSection, sLoginPage, sButtonSubmit, sFormContainer } from "../../styles/styles"

export const Page: FC = () => {
    return <div className='min-h-screen ' style={sLoginPage}>
        <Section style={sLoginSection}>
            <Text as="div" align={"center"} style={{ textAlign: "center", fontSize: "1.5rem", padding: "2rem" }}> Create New Account</Text>
            <Flex direction="column" gap="3" style={sFormContainer}>
                <TextField.Root color="gray" variant="soft" placeholder="Email Address" />
                <TextField.Root color="gray" variant="soft" placeholder="Password" />
                <TextField.Root color="gray" variant="soft" placeholder="Repeat password" />
                <Button color="green" variant="soft" style={sButtonSubmit}>Submit</Button>
            </Flex>
        </Section>
    </div>
};

export default Page;
